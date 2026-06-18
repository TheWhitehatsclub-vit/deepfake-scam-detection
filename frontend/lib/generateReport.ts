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
}

/**
 * Generate a PDF report for deepfake analysis
 */
export async function generateReport(data: ReportData): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Title
  doc.setFontSize(24);
  doc.setTextColor(0, 0, 0);
  doc.text('Deepfake Detection Report', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // File name
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`File: ${data.fileName}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  // Date
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 20;

  // Add image preview if available
  if (data.imageUrl) {
    try {
      const img = await loadImage(data.imageUrl);
      const imgWidth = 100;
      const imgHeight = 75;
      const xPosition = (pageWidth - imgWidth) / 2;
      
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.rect(xPosition, yPosition, imgWidth, imgHeight);
      doc.addImage(img, 'JPEG', xPosition, yPosition, imgWidth, imgHeight);
      yPosition += imgHeight + 15;
    } catch (error) {
      console.error('Error loading image for PDF:', error);
    }
  }

  // Scores Section
  doc.setFillColor(245, 245, 245);
  doc.rect(20, yPosition, pageWidth - 40, 10, 'F');
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Analysis Scores', 25, yPosition + 7);
  yPosition += 15;

  // Authenticity Score
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(`Authenticity Score: ${data.authenticityScore}/100`, 25, yPosition);
  yPosition += 8;

  // Confidence Score
  doc.text(`Confidence Score: ${data.confidenceScore}/100`, 25, yPosition);
  yPosition += 8;

  // Risk Level
  const riskColor = data.riskLevel === 'high' ? [220, 53, 69] : data.riskLevel === 'medium' ? [249, 115, 22] : [34, 197, 94];
  doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.text(`Risk Level: ${data.riskLevel.toUpperCase()}`, 25, yPosition);
  yPosition += 15;

  // Metadata Analysis Section
  doc.setFillColor(245, 245, 245);
  doc.rect(20, yPosition, pageWidth - 40, 10, 'F');
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Metadata Analysis', 25, yPosition + 7);
  yPosition += 15;

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(`Created: ${data.metadataAnalysis.created}`, 25, yPosition);
  yPosition += 6;
  doc.text(`Modified: ${data.metadataAnalysis.modified}`, 25, yPosition);
  yPosition += 6;
  doc.text(`Camera Model: ${data.metadataAnalysis.cameraModel}`, 25, yPosition);
  yPosition += 6;
  doc.text(`GPS Data: ${data.metadataAnalysis.gpsData}`, 25, yPosition);
  yPosition += 6;
  doc.text(`Resolution: ${data.metadataAnalysis.resolution}`, 25, yPosition);
  yPosition += 15;

  // Detection Signals Section
  doc.setFillColor(245, 245, 245);
  doc.rect(20, yPosition, pageWidth - 40, 10, 'F');
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Detection Signals', 25, yPosition + 7);
  yPosition += 15;

  doc.setFontSize(10);
  data.detectionSignals.forEach((signal, index) => {
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = 20;
    }
    
    const signalColor = signal.detected ? [220, 53, 69] : [34, 197, 94];
    doc.setTextColor(signalColor[0], signalColor[1], signalColor[2]);
    doc.text(`${signal.detected ? '[DETECTED]' : '[NOT DETECTED]'} ${signal.name}`, 25, yPosition);
    yPosition += 5;
    
    doc.setTextColor(100, 100, 100);
    doc.text(signal.description, 30, yPosition);
    yPosition += 8;
  });
  yPosition += 10;

  // Explainable Findings Section
  doc.setFillColor(245, 245, 245);
  doc.rect(20, yPosition, pageWidth - 40, 10, 'F');
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Explainable Findings', 25, yPosition + 7);
  yPosition += 15;

  doc.setFontSize(10);
  data.explainableFindings.forEach((finding, index) => {
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setTextColor(0, 0, 0);
    doc.text(`${finding.rank}. ${finding.title} (${finding.impact}% impact)`, 25, yPosition);
    yPosition += 5;
    
    doc.setTextColor(100, 100, 100);
    const descriptionLines = doc.splitTextToSize(finding.description, pageWidth - 50);
    descriptionLines.forEach((line: string) => {
      doc.text(line, 30, yPosition);
      yPosition += 5;
    });
    yPosition += 5;
  });

  // Save the PDF
  doc.save(`deepfake-report-${data.fileName.replace(/\.[^/.]+$/, '')}.pdf`);
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
