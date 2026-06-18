import sharp from 'sharp';

export interface ScoringInput {
  hasEXIF: boolean;
  hasGPS: boolean;
  hasCameraModel: boolean;
  signals: Array<{
    severity: 'low' | 'medium' | 'high';
    status: 'detected' | 'not_detected' | 'warning';
  }>;
  imageBuffer: Buffer;
}

export interface ScoringOutput {
  authenticityScore: number;
  confidenceScore: number;
  riskLevel: 'low' | 'medium' | 'high';
}

/**
 * Calculate metadata integrity score (0-100)
 */
function calculateMetadataScore(hasEXIF: boolean, hasGPS: boolean, hasCameraModel: boolean): number {
  let score = 50; // Base score
  
  if (hasEXIF) {
    score += 20; // EXIF present is good
  } else {
    score -= 20; // Missing EXIF is suspicious
  }
  
  if (hasCameraModel) {
    score += 15; // Camera model adds credibility
  }
  
  if (hasGPS) {
    score += 15; // GPS adds credibility
  }
  
  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate compression consistency score (0-100)
 */
async function calculateCompressionScore(buffer: Buffer): Promise<number> {
  try {
    const metadata = await sharp(buffer).metadata();
    const stats = await sharp(buffer).stats();
    
    let score = 70; // Base score
    
    // Check entropy - higher entropy can indicate manipulation
    const entropy = stats.entropy;
    if (entropy < 6) {
      score += 10; // Low entropy is good
    } else if (entropy > 8) {
      score -= 15; // High entropy is suspicious
    }
    
    // Check format
    if (metadata.format === 'jpeg') {
      // JPEG is lossy, slightly lower base score
      score -= 5;
    } else if (metadata.format === 'png' || metadata.format === 'webp') {
      // Lossless formats are better
      score += 5;
    }
    
    return Math.max(0, Math.min(100, score));
  } catch (error) {
    return 50; // Default score if analysis fails
  }
}

/**
 * Calculate image quality score (0-100)
 */
async function calculateImageQualityScore(buffer: Buffer): Promise<number> {
  try {
    const metadata = await sharp(buffer).metadata();
    const stats = await sharp(buffer).stats();
    
    let score = 60; // Base score
    
    // Check resolution
    const totalPixels = metadata.width * metadata.height;
    if (totalPixels >= 1920 * 1080) {
      score += 20; // HD or better
    } else if (totalPixels >= 1280 * 720) {
      score += 10; // HD
    } else if (totalPixels < 640 * 480) {
      score -= 20; // Very low resolution
    }
    
    // Check color depth
    if (metadata.channels === 4) {
      score += 10; // RGBA is good
    } else if (metadata.channels === 3) {
      score += 5; // RGB is standard
    }
    
    // Check for unusual aspect ratios
    const aspectRatio = metadata.width / metadata.height;
    const commonRatios = [1, 4/3, 16/9, 3/2, 5/4];
    const hasCommonRatio = commonRatios.some(ratio => Math.abs(aspectRatio - ratio) < 0.1);
    
    if (hasCommonRatio) {
      score += 5; // Common aspect ratio is good
    } else {
      score -= 10; // Unusual aspect ratio is suspicious
    }
    
    return Math.max(0, Math.min(100, score));
  } catch (error) {
    return 50; // Default score if analysis fails
  }
}

/**
 * Calculate detection signal severity score (0-100)
 */
function calculateSignalSeverityScore(signals: Array<{ severity: 'low' | 'medium' | 'high'; status: 'detected' | 'not_detected' | 'warning' }>): number {
  let score = 80; // Base score
  
  signals.forEach(signal => {
    if (signal.status === 'detected') {
      if (signal.severity === 'high') {
        score -= 25; // High severity detected is very bad
      } else if (signal.severity === 'medium') {
        score -= 15; // Medium severity detected is bad
      } else {
        score -= 5; // Low severity detected is somewhat bad
      }
    } else if (signal.status === 'warning') {
      score -= 3; // Warnings are minor issues
    }
    // 'not_detected' doesn't affect score
  });
  
  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate overall authenticity score (0-100)
 */
export async function calculateAuthenticityScore(input: ScoringInput): Promise<ScoringOutput> {
  const metadataScore = calculateMetadataScore(input.hasEXIF, input.hasGPS, input.hasCameraModel);
  const compressionScore = await calculateCompressionScore(input.imageBuffer);
  const qualityScore = await calculateImageQualityScore(input.imageBuffer);
  const signalScore = calculateSignalSeverityScore(input.signals);
  
  // Weighted average
  const authenticityScore = Math.round(
    (metadataScore * 0.25) +
    (compressionScore * 0.20) +
    (qualityScore * 0.25) +
    (signalScore * 0.30)
  );
  
  // Calculate confidence score based on consistency of signals
  const detectedCount = input.signals.filter(s => s.status === 'detected').length;
  const totalCount = input.signals.length;
  
  let confidenceScore: number;
  if (detectedCount === 0) {
    confidenceScore = 95; // High confidence when no issues detected
  } else if (detectedCount === 1) {
    confidenceScore = 85; // Still high confidence
  } else if (detectedCount >= 2) {
    confidenceScore = 70; // Lower confidence with multiple issues
  } else {
    confidenceScore = 80; // Default
  }
  
  // Calculate risk level based on authenticity score
  let riskLevel: 'low' | 'medium' | 'high';
  if (authenticityScore >= 70) {
    riskLevel = 'low';
  } else if (authenticityScore >= 40) {
    riskLevel = 'medium';
  } else {
    riskLevel = 'high';
  }
  
  return {
    authenticityScore,
    confidenceScore,
    riskLevel,
  };
}

/**
 * Return default scores for video uploads
 */
export function getVideoDefaultScores(): ScoringOutput {
  return {
    authenticityScore: 0,
    confidenceScore: 0,
    riskLevel: 'low',
  };
}
