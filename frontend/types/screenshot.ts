/**
 * Screenshot Scam Analysis Types
 */

export interface ScamFinding {
  category: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  count?: number;
}

export interface ScreenshotAnalysisResponse {
  success: boolean;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  scam_score?: number;
  risk_level?: 'low' | 'medium' | 'high';
  findings?: ScamFinding[];
  recommendations?: string[];
  extracted_text?: string;
  error?: string;
}

export interface ScreenshotAnalysisResult {
  fileId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  status: 'pending' | 'processing' | 'complete' | 'failed';
  scamScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  findings: ScamFinding[];
  recommendations: string[];
  extractedText: string;
}
