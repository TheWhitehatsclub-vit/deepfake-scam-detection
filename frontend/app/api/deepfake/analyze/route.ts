import { NextRequest, NextResponse } from 'next/server';
import { extractMetadata } from '@/lib/metadata';
import { analyzeDetectionSignals, getVideoAnalysisMessage } from '@/lib/detectionSignals';
import { getVideoDefaultScores } from '@/lib/authenticityScoring';
import { generateExplainableFindings, getVideoFindings } from '@/lib/explainableFindings';

const ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'];
const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB
const FASTAPI_BACKEND_URL = 'http://127.0.0.1:8000/predict';

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
      scoringOutput = {
        ...getVideoDefaultScores(),
        fakeProbability: null,
        realProbability: null,
        heatmapUrl: null,
        heatmapGenerated: false,
        faceFound: false,
        facesDetected: 0,
        faceBoxes: [],
      };
      explainableFindings = getVideoFindings();
    } else {
      // For images, run detection signal analysis and get AI prediction from FastAPI
      const buffer = Buffer.from(await file.arrayBuffer());
      const hasEXIF = !!metadata.exif && Object.keys(metadata.exif).length > 0;
      const hasGPS = !!metadata.exif?.gpsCoordinates;
      const hasCameraModel = !!metadata.exif?.cameraModel;
      
      signalAnalysis = await analyzeDetectionSignals(buffer, hasEXIF, hasGPS, hasCameraModel);
      
      // Upload image to FastAPI backend for AI-based deepfake detection
      try {
        const fastApiFormData = new FormData();
        // Create a new File object from the buffer for FastAPI
        const imageBlob = new Blob([buffer], { type: file.type });
        fastApiFormData.append('file', imageBlob, file.name);

        console.log('Sending image to FastAPI backend:', FASTAPI_BACKEND_URL);
        const fastApiResponse = await fetch(FASTAPI_BACKEND_URL, {
          method: 'POST',
          body: fastApiFormData,
        });

        if (!fastApiResponse.ok) {
          throw new Error(`FastAPI responded with status: ${fastApiResponse.status}`);
        }

        const fastApiResult = await fastApiResponse.json();
        console.log('FastAPI response:', fastApiResult);

        // Extract scores from FastAPI response
        scoringOutput = {
          authenticityScore: Math.round(fastApiResult.authenticity_score || 0),
          confidenceScore: Math.round(fastApiResult.confidence_score || 0),
          riskLevel: (fastApiResult.risk_level || 'medium') as 'low' | 'medium' | 'high',
          fakeProbability: fastApiResult.fake_probability ?? null,
          realProbability: fastApiResult.real_probability ?? null,
          heatmapUrl: fastApiResult.heatmap_url ?? null,
          heatmapGenerated: fastApiResult.heatmap_generated ?? false,
          faceFound: fastApiResult.face_found ?? false,
          facesDetected: fastApiResult.faces_detected ?? 0,
          faceBoxes: fastApiResult.face_boxes ?? [],
        };

        console.log('Scoring output from FastAPI:', scoringOutput);
      } catch (error) {
        console.error('FastAPI backend error:', error);
        return NextResponse.json(
          { 
            success: false, 
            error: 'AI backend unavailable. Please ensure the FastAPI server is running at http://127.0.0.1:8000' 
          },
          { status: 500 }
        );
      }

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
      fakeProbability: scoringOutput.fakeProbability,
      realProbability: scoringOutput.realProbability,
      explainableFindings: explainableFindings,
      heatmap_url: scoringOutput.heatmapUrl,
      heatmap_generated: scoringOutput.heatmapGenerated,
      face_found: scoringOutput.faceFound,
      faces_detected: scoringOutput.facesDetected,
      face_boxes: scoringOutput.faceBoxes,
    });
  } catch (error) {
    console.error('Error processing file upload:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process file upload' },
      { status: 500 }
    );
  }
}
