import { NextRequest, NextResponse } from 'next/server';
import { extractMetadata } from '@/lib/metadata';
import { analyzeDetectionSignals, getVideoAnalysisMessage } from '@/lib/detectionSignals';
import { calculateAuthenticityScore, getVideoDefaultScores } from '@/lib/authenticityScoring';
import { generateExplainableFindings, getVideoFindings } from '@/lib/explainableFindings';

const ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'];
const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    // Validate file exists
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_FORMATS.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Supported: JPG, JPEG, PNG, WEBP, MP4' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 200MB limit' },
        { status: 400 }
      );
    }

    // Extract metadata from the file
    const metadata = await extractMetadata(file);

    // Analyze detection signals
    let signalAnalysis;
    let scoringOutput;
    let explainableFindings;
    
    if (file.type.startsWith('video/')) {
      signalAnalysis = getVideoAnalysisMessage();
      scoringOutput = getVideoDefaultScores();
      explainableFindings = getVideoFindings();
    } else {
      // For images, run detection signal analysis and scoring
      const buffer = Buffer.from(await file.arrayBuffer());
      const hasEXIF = !!metadata.exif && Object.keys(metadata.exif).length > 0;
      const hasGPS = !!metadata.exif?.gpsCoordinates;
      const hasCameraModel = !!metadata.exif?.cameraModel;
      
      signalAnalysis = await analyzeDetectionSignals(buffer, hasEXIF, hasGPS, hasCameraModel);
      
      // Calculate authenticity scores
      scoringOutput = await calculateAuthenticityScore({
        hasEXIF,
        hasGPS,
        hasCameraModel,
        signals: signalAnalysis.signals,
        imageBuffer: buffer,
      });

      // Generate explainable findings
      const hasCompressionIssues = signalAnalysis.signals.some(s => 
        s.name.toLowerCase().includes('compression') && s.status === 'detected'
      );
      const hasColorInconsistency = signalAnalysis.signals.some(s => 
        s.name.toLowerCase().includes('color') && s.status === 'detected'
      );
      const hasResolutionIssues = signalAnalysis.signals.some(s => 
        s.name.toLowerCase().includes('resolution') && s.status === 'detected'
      );

      explainableFindings = generateExplainableFindings({
        signals: signalAnalysis.signals,
        hasEXIF,
        hasGPS,
        hasCameraModel,
        missingEXIF: !hasEXIF,
        hasCompressionIssues,
        hasColorInconsistency,
        hasResolutionIssues,
      });
    }

    // Return success with file info, metadata, signals, scores, and findings
    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      metadata: metadata,
      signals: signalAnalysis.signals,
      overallRisk: signalAnalysis.overallRisk,
      authenticityScore: scoringOutput.authenticityScore,
      confidenceScore: scoringOutput.confidenceScore,
      riskLevel: scoringOutput.riskLevel,
      explainableFindings: explainableFindings,
    });
  } catch (error) {
    console.error('Error processing file upload:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process file upload' },
      { status: 500 }
    );
  }
}
