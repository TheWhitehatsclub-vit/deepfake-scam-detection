import sharp from 'sharp';

export interface DetectionSignal {
  name: string;
  status: 'detected' | 'not_detected' | 'warning';
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export interface SignalAnalysisResult {
  signals: DetectionSignal[];
  overallRisk: 'low' | 'medium' | 'high';
}

/**
 * Analyze compression artifacts in the image
 */
async function analyzeCompression(buffer: Buffer): Promise<DetectionSignal> {
  try {
    const metadata = await sharp(buffer).metadata();
    const stats = await sharp(buffer).stats();
    
    // Check for double compression indicators
    const hasCompressionArtifacts = stats.entropy > 7.5;
    const isJPEG = metadata.format === 'jpeg';
    
    if (isJPEG && hasCompressionArtifacts) {
      return {
        name: 'Double Compression',
        status: 'detected',
        severity: 'high',
        description: 'Evidence of multiple compression passes detected, common in edited images',
      };
    } else if (hasCompressionArtifacts) {
      return {
        name: 'Compression Artifacts',
        status: 'warning',
        severity: 'medium',
        description: 'High compression artifacts detected in image data',
      };
    }
    
    return {
      name: 'Compression Analysis',
      status: 'not_detected',
      severity: 'low',
      description: 'No significant compression artifacts detected',
    };
  } catch (error) {
    return {
      name: 'Compression Analysis',
      status: 'warning',
      severity: 'low',
      description: 'Unable to analyze compression',
    };
  }
}

/**
 * Analyze color consistency across the image
 */
async function analyzeColorConsistency(buffer: Buffer): Promise<DetectionSignal> {
  try {
    const stats = await sharp(buffer).stats();
    
    // Check for unusual color distributions
    const channels = stats.channels;
    const meanVariance = channels.reduce((sum, ch) => sum + ch.stdev, 0) / channels.length;
    
    if (meanVariance > 80) {
      return {
        name: 'Color Inconsistency',
        status: 'detected',
        severity: 'medium',
        description: 'High color variance detected, possible manipulation',
      };
    }
    
    // Check for grayscale anomalies
    const rMean = channels[0].mean;
    const gMean = channels[1].mean;
    const bMean = channels[2].mean;
    const isGrayscale = Math.abs(rMean - gMean) < 5 && Math.abs(gMean - bMean) < 5 && Math.abs(rMean - bMean) < 5;
    
    if (isGrayscale && stats.channels.length === 3) {
      return {
        name: 'Color Anomaly',
        status: 'warning',
        severity: 'low',
        description: 'Image appears grayscale but has color channels',
      };
    }
    
    return {
      name: 'Color Consistency',
      status: 'not_detected',
      severity: 'low',
      description: 'Color distribution appears normal',
    };
  } catch (error) {
    return {
      name: 'Color Consistency',
      status: 'warning',
      severity: 'low',
      description: 'Unable to analyze color consistency',
    };
  }
}

/**
 * Analyze metadata integrity
 */
function analyzeMetadataIntegrity(hasEXIF: boolean, hasGPS: boolean, hasCameraModel: boolean): DetectionSignal {
  if (!hasEXIF) {
    return {
      name: 'Missing EXIF',
      status: 'detected',
      severity: 'medium',
      description: 'No EXIF metadata found - common in edited or generated images',
    };
  }
  
  if (hasEXIF && !hasCameraModel) {
    return {
      name: 'Incomplete Metadata',
      status: 'warning',
      severity: 'low',
      description: 'EXIF present but camera model missing',
    };
  }
  
  if (hasGPS) {
    return {
      name: 'GPS Present',
      status: 'not_detected',
      severity: 'low',
      description: 'GPS coordinates found in metadata',
    };
  }
  
  return {
    name: 'Metadata Integrity',
    status: 'not_detected',
    severity: 'low',
    description: 'Metadata appears intact',
  };
}

/**
 * Analyze resolution integrity
 */
async function analyzeResolutionIntegrity(buffer: Buffer): Promise<DetectionSignal> {
  try {
    const metadata = await sharp(buffer).metadata();
    
    if (!metadata.width || !metadata.height) {
      return {
        name: 'Resolution Analysis',
        status: 'warning',
        severity: 'low',
        description: 'Unable to determine resolution',
      };
    }
    
    // Check for unusual aspect ratios
    const aspectRatio = metadata.width / metadata.height;
    const commonRatios = [1, 4/3, 16/9, 3/2, 5/4];
    const hasCommonRatio = commonRatios.some(ratio => Math.abs(aspectRatio - ratio) < 0.1);
    
    if (!hasCommonRatio) {
      return {
        name: 'Unusual Aspect Ratio',
        status: 'warning',
        severity: 'low',
        description: `Aspect ratio ${aspectRatio.toFixed(2)} is uncommon`,
      };
    }
    
    // Check for very low resolution
    const totalPixels = metadata.width * metadata.height;
    if (totalPixels < 640 * 480) {
      return {
        name: 'Low Resolution',
        status: 'detected',
        severity: 'medium',
        description: 'Very low resolution detected',
      };
    }
    
    return {
      name: 'Resolution Integrity',
      status: 'not_detected',
      severity: 'low',
      description: 'Resolution and aspect ratio appear normal',
    };
  } catch (error) {
    return {
      name: 'Resolution Analysis',
      status: 'warning',
      severity: 'low',
      description: 'Unable to analyze resolution',
    };
  }
}

/**
 * Main function to analyze all detection signals for an image
 */
export async function analyzeDetectionSignals(
  buffer: Buffer,
  hasEXIF: boolean,
  hasGPS: boolean,
  hasCameraModel: boolean
): Promise<SignalAnalysisResult> {
  const signals: DetectionSignal[] = [];
  
  // Run all analyses
  const compressionSignal = await analyzeCompression(buffer);
  signals.push(compressionSignal);
  
  const colorSignal = await analyzeColorConsistency(buffer);
  signals.push(colorSignal);
  
  const metadataSignal = analyzeMetadataIntegrity(hasEXIF, hasGPS, hasCameraModel);
  signals.push(metadataSignal);
  
  const resolutionSignal = await analyzeResolutionIntegrity(buffer);
  signals.push(resolutionSignal);
  
  // Calculate overall risk
  const highSeverityCount = signals.filter(s => s.severity === 'high').length;
  const mediumSeverityCount = signals.filter(s => s.severity === 'medium').length;
  
  let overallRisk: 'low' | 'medium' | 'high' = 'low';
  if (highSeverityCount > 0) {
    overallRisk = 'high';
  } else if (mediumSeverityCount >= 2) {
    overallRisk = 'high';
  } else if (mediumSeverityCount === 1) {
    overallRisk = 'medium';
  }
  
  return {
    signals,
    overallRisk,
  };
}

/**
 * Return a message for video uploads
 */
export function getVideoAnalysisMessage(): SignalAnalysisResult {
  return {
    signals: [
      {
        name: 'Video Analysis',
        status: 'warning',
        severity: 'low',
        description: 'Video analysis coming soon',
      },
    ],
    overallRisk: 'low',
  };
}
