/**
 * Deepfake Detection Analysis Types
 * Defines the complete response structure for deepfake analysis results
 */

export interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  channels: number;
  colorSpace: string;
  density: number;
  fileSize: number;
}

export interface EXIFMetadata {
  cameraModel?: string;
  deviceManufacturer?: string;
  creationDate?: string;
  modificationDate?: string;
  editingSoftware?: string;
  gpsCoordinates?: {
    latitude?: number;
    longitude?: number;
  };
}

export interface VideoMetadata {
  duration: number;
  resolution: string;
  fileSize: number;
  format: string;
}

export interface MetadataAnalysis {
  fileName: string;
  created: string;
  modified: string;
  modifiedFlagged: boolean;
  editingSoftware: string;
  editingSoftwareFlagged: boolean;
  cameraModel: string;
  gpsData: string;
  resolution: string;
  fileHash: string;
  // Real extracted metadata
  imageMetadata?: ImageMetadata;
  exifMetadata?: EXIFMetadata;
  videoMetadata?: VideoMetadata;
  metadataError?: string;
}

export interface DetectionSignal {
  id: string;
  name: string;
  description: string;
  detected: boolean;
  severity: 'low' | 'medium' | 'high';
  confidence: number;
  status?: 'detected' | 'not_detected' | 'warning';
}

export interface FaceAnalysis {
  id: string;
  label: string;
  description: string;
  regions: string[];
  fakeScore: number;
  authenticity: number;
}

export interface ArtifactAnalysis {
  id: string;
  name: string;
  description: string;
  detected: boolean;
  severity: 'low' | 'medium' | 'high';
}

export interface RiskAssessment {
  level: 'low' | 'medium' | 'high';
  score: number;
  description: string;
  recommendedAction: string;
  signalsFlagged: number;
  totalSignals: number;
}

export interface ExplainableFinding {
  rank: number;
  title: string;
  description: string;
  impact: number;
  category: 'facial' | 'pixel' | 'metadata' | 'temporal';
}

export interface ScoreCard {
  authenticityScore: number;
  confidenceScore: number;
  riskScore: number;
}

export interface AnalysisHistoryItem {
  id: string;
  fileName: string;
  fileSize: string;
  fileType: 'image' | 'video';
  date: string;
  authenticityScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  reportAvailable: boolean;
}

export interface GradCAMHeatmap {
  imageUrl: string;
  highActivationRegions: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    intensity: number;
  }>;
  mediumActivationRegions: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    intensity: number;
  }>;
  lowActivationRegions: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    intensity: number;
  }>;
}

export interface FaceDetection {
  id: string;
  label: string;
  boundingBox: {
    top: string;
    left: string;
    width: string;
    height: string;
  };
  confidence: number;
}

export interface AnalysisProgress {
  faceDetection: {
    status: 'pending' | 'processing' | 'complete';
    progress: number;
  };
  artifactScanning: {
    status: 'pending' | 'processing' | 'complete';
    progress: number;
  };
  gradCAMGeneration: {
    status: 'pending' | 'processing' | 'complete';
    progress: number;
  };
}

export interface AnalysisResult {
  // File information
  fileId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  
  // Analysis status
  status: 'pending' | 'processing' | 'complete' | 'failed';
  errorMessage?: string;
  
  // Scores
  scores: ScoreCard;
  
  // Risk assessment
  riskAssessment: RiskAssessment;
  
  // Metadata analysis
  metadataAnalysis: MetadataAnalysis;
  
  // Detection signals
  detectionSignals: DetectionSignal[];
  
  // Artifact analysis
  artifactAnalysis: ArtifactAnalysis[];
  
  // Face analysis
  faceAnalysis: FaceAnalysis[];
  
  // Face detection
  faceDetections: FaceDetection[];
  
  // Grad-CAM heatmap
  gradCAMHeatmap: GradCAMHeatmap;
  
  // Explainable AI report
  explainableFindings: ExplainableFinding[];
  
  // Analysis progress
  progress: AnalysisProgress;
  
  // Analysis history
  history: AnalysisHistoryItem[];
}

export interface DeepfakeAnalysisResponse {
  success: boolean;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  metadata?: {
    type: 'image' | 'video' | 'unknown';
    image?: {
      width: number;
      height: number;
      format: string;
      channels: number;
      colorSpace: string;
      density: number;
      fileSize: number;
    };
    exif?: {
      cameraModel?: string;
      deviceManufacturer?: string;
      creationDate?: string;
      modificationDate?: string;
      editingSoftware?: string;
      gpsCoordinates?: {
        latitude?: number;
        longitude?: number;
      };
    };
    video?: {
      duration: number;
      resolution: string;
      fileSize: number;
      format: string;
    };
    error?: string;
  };
  signals?: Array<{
    name: string;
    status: 'detected' | 'not_detected' | 'warning';
    severity: 'low' | 'medium' | 'high';
    description: string;
  }>;
  overallRisk?: 'low' | 'medium' | 'high';
  authenticityScore?: number;
  confidenceScore?: number;
  riskLevel?: 'low' | 'medium' | 'high';
  fakeProbability?: number | null;
  realProbability?: number | null;
  explainableFindings?: ExplainableFinding[];
  face_found?: boolean;
  faces_detected?: number;
  face_boxes?: number[][];
  heatmap_url?: string;
  heatmap_generated?: boolean;
  result?: AnalysisResult;
  error?: string;
}
