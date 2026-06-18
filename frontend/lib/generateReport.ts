import jsPDF from 'jspdf';
import { AnalysisResult } from '@/types/deepfake';

export interface ReportData {
  fileName: string;
  imageUrl: string | null;
  authenticityScore: number;
  confidenceScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  metadataAnalysis: AnalysisResult['metadataAnalysis'];
  detectionSignals: AnalysisResult['detectionSignals'];
  explainableFindings: AnalysisResult['explainableFindings'];
  heatmapUrl?: string | null;
  faceFound?: boolean;
  facesDetected?: number;
  fullMetadata?: any;
}

/**
 * Generate a PDF report for deepfake analysis
 * Returns the PDF as a blob and the report ID
 */
export async function generateReport(data: ReportData): Promise<{ blob: Blob; reportId: string; fileName: string }> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const reportId = `TS-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  let yPosition = 20;

  // COVER PAGE
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // TrustShield AI Logo placeholder
  doc.setFontSize(32);
  doc.setTextColor(139, 92, 246);
  doc.text('TRUSTSHIELD AI', pageWidth / 2, 60, { align: 'center' });

  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('Deepfake Detection Audit Report', pageWidth / 2, 85, { align: 'center' });

  doc.setFontSize(12);
  doc.setTextColor(200, 200, 200);
  doc.text('Cybersecurity Intelligence & Authenticity Verification', pageWidth / 2, 100, { align: 'center' });

  // Report ID
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text(`Report ID: ${reportId}`, pageWidth / 2, 130, { align: 'center' });

  // File name
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(`Analyzed File: ${data.fileName}`, pageWidth / 2, 145, { align: 'center' });

  // Date
  doc.setFontSize(10);
  doc.setTextColor(200, 200, 200);
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 160, { align: 'center' });

  // Risk badge on cover
  const riskColor = data.riskLevel === 'high' ? [240, 89, 79] : data.riskLevel === 'medium' ? [240, 147, 74] : [20, 200, 168];
  doc.setFillColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.roundedRect(pageWidth / 2 - 40, 180, 80, 25, 5, 5, 'F');
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(`${data.riskLevel.toUpperCase()} RISK`, pageWidth / 2, 197, { align: 'center' });

  // Add new page for executive summary
  doc.addPage();
  yPosition = 20;

  // EXECUTIVE SUMMARY
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 15, 'F');
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('EXECUTIVE SUMMARY', 20, yPosition + 10);
  yPosition += 25;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  const summaryText = `This report presents a comprehensive analysis of the submitted media file using TrustShield AI's advanced deepfake detection system. The analysis evaluated multiple indicators including metadata integrity, pixel-level artifacts, AI-generated patterns, and facial consistency. The overall authenticity score of ${data.authenticityScore}/100 indicates ${data.riskLevel === 'high' ? 'significant concerns' : data.riskLevel === 'medium' ? 'moderate concerns' : 'minimal concerns'} regarding the authenticity of the content.`;
  const summaryLines = doc.splitTextToSize(summaryText, pageWidth - 40);
  summaryLines.forEach((line: string) => {
    doc.text(line, 20, yPosition);
    yPosition += 6;
  });
  yPosition += 15;

  // SCORES SECTION
  doc.setFillColor(139, 92, 246);
  doc.rect(20, yPosition, pageWidth - 40, 10, 'F');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('ANALYSIS SCORES', 25, yPosition + 7);
  yPosition += 15;

  // Authenticity Score
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text('Authenticity Score:', 25, yPosition);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(139, 92, 246);
  doc.text(`${data.authenticityScore}/100`, 80, yPosition);
  yPosition += 10;

  // Confidence Score
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text('Confidence Score:', 25, yPosition);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(139, 92, 246);
  doc.text(`${data.confidenceScore}/100`, 80, yPosition);
  yPosition += 10;

  // Risk Level
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text('Risk Level:', 25, yPosition);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.text(data.riskLevel.toUpperCase(), 80, yPosition);
  yPosition += 20;

  // METADATA TABLE
  doc.setFillColor(139, 92, 246);
  doc.rect(20, yPosition, pageWidth - 40, 10, 'F');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('METADATA ANALYSIS', 25, yPosition + 7);
  yPosition += 15;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);

  const metadataData = [
    ['Field', 'Value'],
    ['Created', data.metadataAnalysis.created],
    ['Modified', data.metadataAnalysis.modified],
    ['Camera Model', data.metadataAnalysis.cameraModel],
    ['GPS Data', data.metadataAnalysis.gpsData],
    ['Resolution', data.metadataAnalysis.resolution],
  ];

  let yPos = yPosition;
  metadataData.forEach((row, rowIndex) => {
    if (rowIndex === 0) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(139, 92, 246);
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
    }
    doc.text(row[0], 25, yPos);
    doc.text(row[1], 80, yPos);
    yPos += 8;
  });
  yPosition = yPos + 10;

  // ARTIFACT ANALYSIS TABLE
  if (yPosition > pageHeight - 80) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFillColor(139, 92, 246);
  doc.rect(20, yPosition, pageWidth - 40, 10, 'F');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('ARTIFACT ANALYSIS', 25, yPosition + 7);
  yPosition += 15;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);

  const artifactData = [
    ['Signal', 'Status', 'Description'],
  ];

  data.detectionSignals.forEach((signal) => {
    artifactData.push([
      signal.name,
      signal.detected ? 'DETECTED' : 'NOT DETECTED',
      signal.description.substring(0, 50) + '...'
    ]);
  });

  yPos = yPosition;
  artifactData.forEach((row, rowIndex) => {
    if (yPos > pageHeight - 20) {
      doc.addPage();
      yPos = 20;
    }
    if (rowIndex === 0) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(139, 92, 246);
    } else {
      doc.setFont('helvetica', 'normal');
      const signalColor = row[1] === 'DETECTED' ? [240, 89, 79] : [20, 200, 168];
      doc.setTextColor(signalColor[0], signalColor[1], signalColor[2]);
    }
    doc.text(row[0], 25, yPos);
    doc.text(row[1], 80, yPos);
    doc.text(row[2], 130, yPos);
    yPos += 7;
  });
  yPosition = yPos + 15;

  // GRAD-CAM HEATMAP
  if (data.heatmapUrl) {
    if (yPosition > pageHeight - 100) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFillColor(139, 92, 246);
    doc.rect(20, yPosition, pageWidth - 40, 10, 'F');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('AI ATTENTION HEATMAP', 25, yPosition + 7);
    yPosition += 15;

    try {
      const heatmapImg = await loadImage(data.heatmapUrl);
      const imgWidth = 80;
      const imgHeight = 60;
      const xPosition = (pageWidth - imgWidth) / 2;

      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.rect(xPosition, yPosition, imgWidth, imgHeight);
      doc.addImage(heatmapImg, 'JPEG', xPosition, yPosition, imgWidth, imgHeight);
      yPosition += imgHeight + 10;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text('The heatmap above shows regions that most influenced the AI model\'s decision.', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;
    } catch (error) {
      console.error('Error loading heatmap for PDF:', error);
    }
  }

  // DETECTED FACES SUMMARY
  if (data.faceFound !== undefined) {
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFillColor(139, 92, 246);
    doc.rect(20, yPosition, pageWidth - 40, 10, 'F');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('FACE ANALYSIS SUMMARY', 25, yPosition + 7);
    yPosition += 15;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);

    if (data.faceFound) {
      doc.text(`Faces Detected: ${data.facesDetected || 0}`, 25, yPosition);
      yPosition += 8;
      doc.text(`Image Type: ${(data.facesDetected || 0) > 1 ? 'Group Photo' : 'Single Person'}`, 25, yPosition);
      yPosition += 8;
      doc.text('Detection Status: Active', 25, yPosition);
      yPosition += 8;
      doc.setTextColor(20, 200, 168);
      doc.text('✓ Faces successfully identified and included in authenticity analysis', 25, yPosition);
    } else {
      doc.text('Faces Detected: 0', 25, yPosition);
      yPosition += 8;
      doc.setTextColor(150, 150, 150);
      doc.text('No faces detected in the uploaded image', 25, yPosition);
    }
    yPosition += 15;
  }

  // EXPLAINABLE AI FINDINGS
  if (yPosition > pageHeight - 80) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFillColor(139, 92, 246);
  doc.rect(20, yPosition, pageWidth - 40, 10, 'F');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('EXPLAINABLE AI FINDINGS', 25, yPosition + 7);
  yPosition += 15;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);

  const uniqueFindings = data.explainableFindings.filter((finding, index, self) =>
    index === self.findIndex((f) => f.title === finding.title)
  );

  uniqueFindings.forEach((finding) => {
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(`${finding.rank}. ${finding.title}`, 25, yPosition);
    yPosition += 6;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    const descriptionLines = doc.splitTextToSize(finding.description, pageWidth - 50);
    descriptionLines.forEach((line: string) => {
      doc.text(line, 30, yPosition);
      yPosition += 5;
    });
    yPosition += 8;
  });

  // FINAL RECOMMENDATION
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFillColor(139, 92, 246);
  doc.rect(20, yPosition, pageWidth - 40, 10, 'F');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('FINAL RECOMMENDATION', 25, yPosition + 7);
  yPosition += 15;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);

  let recommendation = '';
  if (data.riskLevel === 'high') {
    recommendation = 'This content exhibits significant indicators of manipulation or AI generation. We strongly recommend against using or sharing this media without independent verification. The detected patterns are consistent with sophisticated deepfake techniques.';
  } else if (data.riskLevel === 'medium') {
    recommendation = 'This content shows some concerning patterns that warrant further investigation. While not definitively manipulated, we recommend verifying the source and context before making decisions based on this content.';
  } else {
    recommendation = 'This content shows minimal indicators of manipulation. The analysis suggests the media is likely authentic, though no detection method is 100% foolproof. Standard verification practices are still recommended for sensitive content.';
  }

  const recLines = doc.splitTextToSize(recommendation, pageWidth - 40);
  recLines.forEach((line: string) => {
    doc.text(line, 20, yPosition);
    yPosition += 6;
  });

  // Footer
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`TrustShield AI Deepfake Detection Report | Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  }

  // Generate blob
  const blob = doc.output('blob');
  const fileName = `trustshield-report-${data.fileName.replace(/\.[^/.]+$/, '')}-${reportId}.pdf`;

  return { blob, reportId, fileName };
}

/**
 * Load an image from URL for PDF generation
 */
async function loadImage(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      } else {
        reject(new Error('Failed to get canvas context'));
      }
    };
    img.onerror = reject;
    img.src = url;
  });
}
