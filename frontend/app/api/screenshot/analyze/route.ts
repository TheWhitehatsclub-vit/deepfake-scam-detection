import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const FASTAPI_BACKEND_URL =
  'http://127.0.0.1:8000/analyze';

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
        { success: false, error: 'Invalid file type. Supported: JPG, JPEG, PNG, WEBP' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 50MB limit' },
        { status: 400 }
      );
    }

    // Upload screenshot to FastAPI backend for scam analysis
    try {
      const fastApiFormData = new FormData();
      const buffer = Buffer.from(await file.arrayBuffer());
      const imageBlob = new Blob([buffer], { type: file.type });
      fastApiFormData.append('file', imageBlob, file.name);

      console.log('Sending screenshot to FastAPI backend:', FASTAPI_BACKEND_URL);
      const fastApiResponse = await fetch(FASTAPI_BACKEND_URL, {
        method: 'POST',
        body: fastApiFormData,
      });

      if (!fastApiResponse.ok) {
        throw new Error(`FastAPI responded with status: ${fastApiResponse.status}`);
      }

      const fastApiResult = await fastApiResponse.json();
      console.log('FastAPI screenshot analysis response:', fastApiResult);

      // Return the analysis results
      return NextResponse.json({
        success: true,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        scam_score: fastApiResult.scam_score,
        risk_level: fastApiResult.risk_level,
        findings: fastApiResult.findings,
        recommendations: fastApiResult.recommendations,
        extracted_text: fastApiResult.extracted_text,
      });
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
  } catch (error) {
    console.error('Error processing screenshot upload:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process screenshot upload' },
      { status: 500 }
    );
  }
}
