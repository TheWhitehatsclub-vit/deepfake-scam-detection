export interface ExplainableFinding {
  rank: number;
  title: string;
  description: string;
  impact: number;
  category: 'facial' | 'pixel' | 'metadata' | 'temporal';
}

export interface FindingsInput {
  signals: Array<{
    name: string;
    status: 'detected' | 'not_detected' | 'warning';
    severity: 'low' | 'medium' | 'high';
    description: string;
  }>;
  hasEXIF: boolean;
  hasGPS: boolean;
  hasCameraModel: boolean;
  missingEXIF: boolean;
  hasCompressionIssues: boolean;
  hasColorInconsistency: boolean;
  hasResolutionIssues: boolean;
}

/**
 * Generate explainable findings from detection signals and metadata analysis
 */
export function generateExplainableFindings(input: FindingsInput): ExplainableFinding[] {
  const findings: ExplainableFinding[] = [];
  let rank = 1;

  // Generate findings from detected signals
  input.signals.forEach(signal => {
    if (signal.status === 'detected') {
      let category: 'facial' | 'pixel' | 'metadata' | 'temporal' = 'pixel';
      let impact = 20;

      // Determine category and impact based on signal name
      if (signal.name.toLowerCase().includes('compression')) {
        category = 'pixel';
        impact = signal.severity === 'high' ? 35 : signal.severity === 'medium' ? 25 : 15;
      } else if (signal.name.toLowerCase().includes('color')) {
        category = 'pixel';
        impact = signal.severity === 'high' ? 30 : signal.severity === 'medium' ? 20 : 10;
      } else if (signal.name.toLowerCase().includes('metadata') || signal.name.toLowerCase().includes('exif')) {
        category = 'metadata';
        impact = signal.severity === 'high' ? 25 : signal.severity === 'medium' ? 15 : 10;
      } else if (signal.name.toLowerCase().includes('resolution')) {
        category = 'pixel';
        impact = signal.severity === 'high' ? 20 : signal.severity === 'medium' ? 12 : 8;
      } else {
        category = 'pixel';
        impact = signal.severity === 'high' ? 25 : signal.severity === 'medium' ? 15 : 10;
      }

      findings.push({
        rank: rank++,
        title: signal.name,
        description: signal.description,
        impact,
        category,
      });
    }
  });

  // Generate findings from metadata analysis
  if (input.missingEXIF) {
    findings.push({
      rank: rank++,
      title: 'Missing EXIF Metadata',
      description: 'No EXIF metadata was found in the image file. This is common in edited, generated, or stripped images and reduces the ability to verify authenticity.',
      impact: 30,
      category: 'metadata',
    });
  }

  if (input.hasEXIF && !input.hasCameraModel) {
    findings.push({
      rank: rank++,
      title: 'Incomplete Camera Information',
      description: 'EXIF metadata is present but camera model information is missing, which may indicate metadata manipulation or incomplete original data.',
      impact: 15,
      category: 'metadata',
    });
  }

  if (input.hasGPS) {
    findings.push({
      rank: rank++,
      title: 'GPS Coordinates Present',
      description: 'GPS location data was found in the image metadata, which can help verify the origin and authenticity of the content.',
      impact: 5,
      category: 'metadata',
    });
  }

  if (input.hasCompressionIssues) {
    findings.push({
      rank: rank++,
      title: 'Compression Artifacts Detected',
      description: 'Analysis detected evidence of multiple compression passes or high compression artifacts, which often indicate the image has been edited or resaved.',
      impact: 25,
      category: 'pixel',
    });
  }

  if (input.hasColorInconsistency) {
    findings.push({
      rank: rank++,
      title: 'Color Distribution Anomaly',
      description: 'Unusual color variance or distribution patterns were detected in the image, which may indicate manipulation or generation by AI models.',
      impact: 20,
      category: 'pixel',
    });
  }

  if (input.hasResolutionIssues) {
    findings.push({
      rank: rank++,
      title: 'Resolution Concerns',
      description: 'The image resolution or aspect ratio is unusual or very low, which can affect the reliability of analysis and may indicate manipulation.',
      impact: 15,
      category: 'pixel',
    });
  }

  // Sort findings by impact (highest first)
  findings.sort((a, b) => b.impact - a.impact);

  // Re-rank after sorting
  findings.forEach((finding, index) => {
    finding.rank = index + 1;
  });

  // Normalize impact percentages to sum to 100
  const totalImpact = findings.reduce((sum, f) => sum + f.impact, 0);
  if (totalImpact > 0) {
    findings.forEach(finding => {
      finding.impact = Math.round((finding.impact / totalImpact) * 100);
    });
  }

  return findings;
}

/**
 * Return default findings for video uploads
 */
export function getVideoFindings(): ExplainableFinding[] {
  return [
    {
      rank: 1,
      title: 'Video Analysis Coming Soon',
      description: 'Video analysis capabilities are under development. Full deepfake detection for video files will be available in a future update.',
      impact: 100,
      category: 'temporal',
    },
  ];
}
