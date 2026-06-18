'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { AnalysisResult, DeepfakeAnalysisResponse } from '@/types/deepfake';
import { saveAnalysisRecord, fetchAnalysisHistory, analysisResultToHistoryRecord, updateAnalysisRecordPdfPath } from '@/lib/analysisHistory';
import { generateReport } from '@/lib/generateReport';
import FaceDetectionOverlay from '@/components/FaceDetectionOverlay';
import AISafetyAssistant from '@/components/AISafetyAssistant';

export default function DeepfakeDetectionClient() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResponse, setUploadResponse] = useState<DeepfakeAnalysisResponse | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [faceBoxes, setFaceBoxes] = useState<number[][] | null>(null);
  const [heatmapUrl, setHeatmapUrl] = useState<string | null>(null);
  const [heatmapGenerated, setHeatmapGenerated] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch analysis history on component mount
  useEffect(() => {
    const loadHistory = async () => {
      const { data } = await fetchAnalysisHistory(10);
      setHistoryData(data);
    };
    loadHistory();
  }, []);

  // Cleanup object URL when component unmounts
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const handleDropzoneClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadResponse(null);
      setAnalysisResult(null);
      setFaceBoxes(null);
      setHeatmapUrl(null);
      setHeatmapGenerated(false);
      
      // Create preview URL
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadResponse(null);
      setAnalysisResult(null);
      setFaceBoxes(null);
      setHeatmapUrl(null);
      setHeatmapGenerated(false);
      
      // Create preview URL
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    console.log('ANALYZE_STARTED', { fileName: selectedFile.name, fileSize: selectedFile.size, fileType: selectedFile.type });
    setIsUploading(true);
    setUploadResponse(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/deepfake/analyze', {
        method: 'POST',
        body: formData,
      });

      const data: DeepfakeAnalysisResponse = await response.json();
      console.log("API Response:", data);
      setUploadResponse(data);
      console.log('ANALYSIS_COMPLETE', { success: data.success, authenticityScore: data.authenticityScore, confidenceScore: data.confidenceScore, riskLevel: data.riskLevel });

      // Extract face boxes from API response
      if (data.face_boxes) {
        setFaceBoxes(data.face_boxes);
        console.log('FACE_BOXES', data.face_boxes);
      }

      // Extract heatmap data from API response
      if (data.heatmap_url) {
        const API_BASE_URL = 'http://127.0.0.1:8000';
        const fullHeatmapUrl = data.heatmap_url.startsWith('http')
          ? data.heatmap_url
          : `${API_BASE_URL}${data.heatmap_url}`;
        console.log('Heatmap URL from backend:', data.heatmap_url);
        console.log('Final Heatmap URL:', fullHeatmapUrl);
        setHeatmapUrl(fullHeatmapUrl);
      }
      if (data.heatmap_generated !== undefined) {
        setHeatmapGenerated(data.heatmap_generated);
        console.log('HEATMAP_GENERATED', data.heatmap_generated);
      }

      // Set mock analysis result after successful upload with real metadata, signals, scores, and findings
      if (data.success) {
        console.log("FASTAPI_RESPONSE", data);
        console.log("VALUES_BEING_SENT", {
  authenticityScore: data.authenticityScore,
  confidenceScore: data.confidenceScore,
  riskLevel: data.riskLevel,
});
        const result = createMockAnalysisResult(
          selectedFile.name,
          selectedFile.size,
          selectedFile.type,
          data.metadata,
          data.signals,
          data.overallRisk,
          data.authenticityScore,
          data.confidenceScore,
          data.riskLevel,
          data.explainableFindings,
          imagePreviewUrl
        );
        setAnalysisResult(result);

        // Save analysis record to Supabase
        if (data.authenticityScore !== undefined && data.confidenceScore !== undefined && data.riskLevel) {
          console.log('SAVING_TO_SUPABASE', { fileName: selectedFile.name, authenticityScore: data.authenticityScore, confidenceScore: data.confidenceScore, riskLevel: data.riskLevel });
          const metadataSummary = `Format: ${data.metadata?.image?.format || 'unknown'}, Resolution: ${data.metadata?.image ? `${data.metadata.image.width}x${data.metadata.image.height}` : 'unknown'}`;
          const record = analysisResultToHistoryRecord(
            selectedFile.name,
            data.authenticityScore,
            data.confidenceScore,
            data.riskLevel,
            metadataSummary,
            undefined, // report_id - will be set after PDF generation
            undefined, // pdf_path - will be set after PDF generation
            data.heatmap_url,
            data
          );
          const saveResult = await saveAnalysisRecord(record);
          console.log('SUPABASE_RESPONSE', saveResult);
          
          // Refresh history after saving
          const { data: refreshedHistory } = await fetchAnalysisHistory(10);
          setHistoryData(refreshedHistory);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadResponse({ success: false, error: 'Failed to upload file' });
    } finally {
      setIsUploading(false);
    }
  };

  const createMockAnalysisResult = (
    fileName: string,
    fileSize: number,
    fileType: string,
    metadata?: DeepfakeAnalysisResponse['metadata'],
    signals?: DeepfakeAnalysisResponse['signals'],
    overallRisk?: DeepfakeAnalysisResponse['overallRisk'],
    authenticityScore?: number,
    confidenceScore?: number,
    riskLevel?: DeepfakeAnalysisResponse['riskLevel'],
    explainableFindings?: DeepfakeAnalysisResponse['explainableFindings'],
    imageUrl?: string | null
  ): AnalysisResult => ({
    fileId: 'df-' + Date.now(),
    fileName,
    fileType,
    fileSize,
    uploadedAt: new Date().toISOString(),
    status: 'complete',
    scores: {
      authenticityScore: authenticityScore ?? 50,
      confidenceScore: confidenceScore ?? 80,
      riskScore: riskLevel === 'high' ? 85 : riskLevel === 'medium' ? 50 : 20,
    },
    riskAssessment: {
      level: riskLevel || overallRisk || 'medium',
      score: riskLevel === 'high' ? 85 : riskLevel === 'medium' ? 50 : 20,
      description: riskLevel === 'high' ? 'Likely manipulated — high risk detected' : riskLevel === 'medium' ? 'Some anomalies detected — medium risk' : 'No significant issues detected',
      recommendedAction: riskLevel === 'high' ? 'Do not share or trust without verification' : riskLevel === 'medium' ? 'Review carefully before sharing' : 'Content appears authentic',
      signalsFlagged: signals?.filter(s => s.status === 'detected').length || 0,
      totalSignals: signals?.length || 4,
    },
    metadataAnalysis: {
      fileName,
      created: metadata?.exif?.creationDate || 'Not Available',
      modified: metadata?.exif?.modificationDate || 'Not Available',
      modifiedFlagged: false,
      editingSoftware: metadata?.exif?.editingSoftware || 'Not Available',
      editingSoftwareFlagged: false,
      cameraModel: metadata?.exif?.cameraModel || 'Not Available',
      gpsData: metadata?.exif?.gpsCoordinates && metadata.exif.gpsCoordinates.latitude !== undefined && metadata.exif.gpsCoordinates.longitude !== undefined 
        ? `${metadata.exif.gpsCoordinates.latitude.toFixed(6)}, ${metadata.exif.gpsCoordinates.longitude.toFixed(6)}` 
        : 'Not Available',
      resolution: metadata?.image ? `${metadata.image.width} × ${metadata.image.height}` : metadata?.video?.resolution || 'Not Available',
      fileHash: 'Not Available',
      imageMetadata: metadata?.image,
      exifMetadata: metadata?.exif,
      videoMetadata: metadata?.video,
      metadataError: metadata?.error,
    },
    detectionSignals: (signals || []).map((signal, index) => ({
      id: `ds-${index}`,
      name: signal.name,
      description: signal.description,
      detected: signal.status === 'detected',
      severity: signal.severity,
      confidence: signal.severity === 'high' ? 0.9 : signal.severity === 'medium' ? 0.7 : 0.5,
    })),
    artifactAnalysis: (signals || []).map((signal, index) => ({
      id: `aa-${index}`,
      name: signal.name,
      description: signal.description,
      detected: signal.status === 'detected',
      severity: signal.severity,
    })),
    faceAnalysis: [],
    faceDetections: [],
    gradCAMHeatmap: {
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=700&h=520&fit=crop',
      highActivationRegions: [],
      mediumActivationRegions: [],
      lowActivationRegions: [],
    },
    explainableFindings: explainableFindings || [],
    progress: {
      faceDetection: {
        status: analysisResult ? 'complete' : 'pending',
        progress: analysisResult ? 100 : 0,
      },
      artifactScanning: {
        status: analysisResult ? 'complete' : 'pending',
        progress: analysisResult ? 100 : 0,
      },
      gradCAMGeneration: {
        status: analysisResult ? 'complete' : 'pending',
        progress: analysisResult ? 100 : 0,
      },
    },
    history: historyData.map((record, index) => ({
      id: `ah-${index}`,
      fileName: record.filename,
      fileSize: 'Unknown',
      fileType: 'image',
      date: new Date(record.upload_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      authenticityScore: record.authenticity_score,
      riskLevel: record.risk_level,
      reportAvailable: true,
    })),
  });

  const handleDownloadReport = async () => {
    if (!analysisResult || !selectedFile || !uploadResponse) return;

    try {
      const { blob, reportId, fileName } = await generateReport({
        fileName: analysisResult.fileName,
        imageUrl: imagePreviewUrl,
        authenticityScore: analysisResult.scores.authenticityScore,
        confidenceScore: analysisResult.scores.confidenceScore,
        riskLevel: analysisResult.riskAssessment.level,
        metadataAnalysis: analysisResult.metadataAnalysis,
        detectionSignals: analysisResult.detectionSignals,
        explainableFindings: analysisResult.explainableFindings,
        heatmapUrl: heatmapUrl,
        faceFound: uploadResponse.face_found,
        facesDetected: uploadResponse.faces_detected,
        fullMetadata: uploadResponse.metadata,
      });

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Update history record with PDF path and report ID
      const historyData = await fetchAnalysisHistory(1);
      if (historyData.data.length > 0) {
        const latestRecord = historyData.data[0];
        if (latestRecord.id) {
          await updateAnalysisRecordPdfPath(latestRecord.id, fileName, reportId);
        }
      }

      console.log('Report generated and saved:', { reportId, fileName });
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const handleHistoryDownload = async (record: any) => {
    try {
      // Check if PDF already exists
      if (record.pdf_path && record.report_id) {
        // Download existing PDF
        // For now, we'll regenerate since we don't have file storage
        console.log('PDF exists, regenerating for download:', record.pdf_path);
      }

      // Regenerate PDF from stored analysis data
      if (record.full_metadata) {
        const { blob, reportId, fileName } = await generateReport({
          fileName: record.filename,
          imageUrl: null, // We don't have the original image in history
          authenticityScore: record.authenticity_score,
          confidenceScore: record.confidence_score,
          riskLevel: record.risk_level,
          metadataAnalysis: {
            fileName: record.filename,
            created: record.full_metadata?.exif?.creationDate || 'Not Available',
            modified: record.full_metadata?.exif?.modificationDate || 'Not Available',
            modifiedFlagged: false,
            editingSoftware: record.full_metadata?.exif?.editingSoftware || 'Not Available',
            editingSoftwareFlagged: false,
            cameraModel: record.full_metadata?.exif?.cameraModel || 'Not Available',
            gpsData: record.full_metadata?.exif?.gpsCoordinates ? 'Available' : 'Not Available',
            resolution: record.full_metadata?.image ? `${record.full_metadata.image.width}x${record.full_metadata.image.height}` : 'Unknown',
            fileHash: 'Not Available',
          },
          detectionSignals: record.full_metadata?.signals || [],
          explainableFindings: record.full_metadata?.explainableFindings || [],
          heatmapUrl: record.heatmap_path || null,
          faceFound: record.full_metadata?.face_found,
          facesDetected: record.full_metadata?.faces_detected,
          fullMetadata: record.full_metadata,
        });

        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        // Update history record with PDF path and report ID
        if (record.id) {
          await updateAnalysisRecordPdfPath(record.id, fileName, reportId);
        }

        console.log('History report generated and saved:', { reportId, fileName });
      }
    } catch (error) {
      console.error('Error generating history report:', error);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <>
      <div className="crumb-bar">
        <div className="container">
          <div className="crumb">
            <Link href="/">Home</Link>
            <i className="ti ti-chevron-right" />
            <Link href="/features">Features</Link>
            <i className="ti ti-chevron-right" />
            <span className="current">Deepfake Image / Video Detection</span>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <div className="hero-icon-badge"><i className="ti ti-face-id" /></div>
            <div className="eyebrow-pill"><span className="dot" />MODULE 01 · DEEPFAKE DETECTION</div>
            <h1 className="h-title">Detect <span className="grad-text">deepfakes</span> in any image or video, frame by frame.</h1>
            <p className="hero-sub">Upload a photo or video clip and our model inspects facial geometry, blink timing, lighting consistency, and compression artifacts — then explains exactly what it found, with visual proof.</p>
            <div className="hero-stats">
              <div className="hero-stat"><strong>AI-Powered</strong><span>Deepfake detection</span></div>
              <div className="hero-stat"><strong>Real-time</strong><span>Analysis</span></div>
              <div className="hero-stat"><strong>Multi-signal</strong><span>Detection</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* WORKSPACE: upload panel + live scan panel */}
      <section className="workspace">
        <div className="container ws-grid">

          {/* LEFT: Upload */}
          <div className="panel">
            <div className="panel-head">
              <h3><i className="ti ti-upload" />Image Upload</h3>
              <span className="panel-tag">STEP 1</span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.mp4"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            {selectedFile ? (
              <div className="dropzone" style={{ cursor: 'default' }}>
                <div className="dropzone-icon"><i className="ti ti-file" /></div>
                <strong>{selectedFile.name}</strong>
                <p>{formatFileSize(selectedFile.size)} · {selectedFile.type}</p>
                <div className="format-tags">
                  <span className="format-tag">{selectedFile.name.split('.').pop()?.toUpperCase()}</span>
                  <span className="format-tag">{formatFileSize(selectedFile.size)}</span>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  style={{
                    marginTop: '16px',
                    padding: '8px 16px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'white',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Clear
                </button>
              </div>
            ) : (
              <div
                className={`dropzone ${isDragOver ? 'dropzone-active' : ''}`}
                onClick={handleDropzoneClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{ cursor: 'pointer' }}
              >
                <div className="dropzone-icon"><i className="ti ti-cloud-upload" /></div>
                <strong>Drop your image or video here</strong>
                <p>or click to browse from your device</p>
                <div className="format-tags">
                  <span className="format-tag">JPG</span>
                  <span className="format-tag">PNG</span>
                  <span className="format-tag">MP4</span>
                  <span className="format-tag">WEBM</span>
                  <span className="format-tag">Max 200MB</span>
                </div>
              </div>
            )}
            {selectedFile && (
              <button
                className="btn-primary btn-lg"
                onClick={handleAnalyze}
                disabled={isUploading}
                style={{ marginTop: '16px', width: '100%' }}
              >
                {isUploading ? 'Uploading...' : 'Analyze'}
              </button>
            )}
            {uploadResponse && (
              <div style={{ marginTop: '16px', padding: '12px', borderRadius: '4px', background: uploadResponse.success ? 'rgba(20,200,168,0.15)' : 'rgba(240,89,79,0.15)', border: `1px solid ${uploadResponse.success ? '#14C8A8' : '#F0594F'}` }}>
                {uploadResponse.success ? (
                  <div>
                    <strong style={{ color: '#14C8A8' }}>Upload successful!</strong>
                    <div style={{ marginTop: '8px', fontSize: '13px' }}>
                      <div>File: {selectedFile?.name}</div>
                      <div>Type: {selectedFile?.type}</div>
                      <div>Size: {selectedFile?.size} bytes</div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <strong style={{ color: '#F0594F' }}>Upload failed</strong>
                    <div style={{ marginTop: '8px', fontSize: '13px' }}>{uploadResponse.error}</div>
                  </div>
                )}
              </div>
            )}
            {uploadResponse?.success && imagePreviewUrl && (
              <div style={{ marginTop: '16px' }}>
                <FaceDetectionOverlay imageUrl={imagePreviewUrl} faceBoxes={faceBoxes} />
              </div>
            )}
            <div className="model-row">
              <div className="model-chip">
                <div className="model-chip-left"><i className="ti ti-cpu" /><span>Deepfake Detection Model</span></div>
                <span className="status">ACTIVE</span>
              </div>
              <div className="model-chip">
                <div className="model-chip-left"><i className="ti ti-face-id" /><span>Face Detection Engine</span></div>
                <span className="status">ACTIVE</span>
              </div>
              <div className="model-chip">
                <div className="model-chip-left"><i className="ti ti-file-info" /><span>Metadata Analyzer</span></div>
                <span className="status">ACTIVE</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Live scan preview */}
          <div className="panel">
            <div className="panel-head">
              <h3><i className="ti ti-scan" />Live Analysis</h3>
              <span className="panel-tag">PROCESSING</span>
            </div>
            <div className="preview-frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagePreviewUrl || 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=700&h=480&fit=crop'} alt="Face being analyzed for deepfake markers" />
              <div className="grid-overlay" />
              <div className="face-box" data-label={analysisResult?.faceDetections[0]?.label || ''} style={{ top: '14%', left: '30%', width: '38%', height: '55%' }} />
              <div className="scan-sweep" />
              <div className="preview-tag"><span className="rec" />{selectedFile?.name || 'No file selected'}</div>
            </div>
            <div className="progress-row">
              <div className="progress-item">
                <i className={analysisResult?.progress.faceDetection.status === 'complete' ? 'ti ti-circle-check' : analysisResult?.progress.faceDetection.status === 'processing' ? 'ti ti-loader-2' : 'ti ti-circle'} />
                <div className="ptext"><strong>Face detection</strong><div className="progress-bar-track"><div className="progress-bar-fill" style={{ width: `${analysisResult?.progress.faceDetection.progress || 0}%` }} /></div></div>
              </div>
              <div className="progress-item">
                <i className={analysisResult?.progress.artifactScanning.status === 'complete' ? 'ti ti-circle-check' : analysisResult?.progress.artifactScanning.status === 'processing' ? 'ti ti-loader-2' : 'ti ti-circle'} />
                <div className="ptext"><strong>Artifact scanning</strong><div className="progress-bar-track"><div className="progress-bar-fill" style={{ width: `${analysisResult?.progress.artifactScanning.progress || 0}%` }} /></div></div>
              </div>
              <div className="progress-item">
                <i className={analysisResult?.progress.gradCAMGeneration.status === 'complete' ? 'ti ti-circle-check' : analysisResult?.progress.gradCAMGeneration.status === 'processing' ? 'ti ti-loader-2' : 'ti ti-circle'} />
                <div className="ptext"><strong>Generating Grad-CAM heatmap</strong><div className="progress-bar-track"><div className="progress-bar-fill" style={{ width: `${analysisResult?.progress.gradCAMGeneration.progress || 0}%` }} /></div></div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* VERDICT BANNER */}
      <section className="results-strip">
        <div className="container">
          <div className="verdict-banner">
            <div className="verdict-left">
              <div className="verdict-icon"><i className="ti ti-alert-triangle" /></div>
              <div>
                <strong>{analysisResult?.riskAssessment.description || 'Awaiting analysis'}</strong>
                <span>{analysisResult?.riskAssessment.signalsFlagged || 0} of {analysisResult?.riskAssessment.totalSignals || 0} signals flagged · review the breakdown below before trusting this content</span>
              </div>
            </div>
            <div className="verdict-actions">
              <a className="btn-outline" onClick={handleDownloadReport}><i className="ti ti-download" style={{ fontSize: 14 }} />Download Report</a>
              <a className="btn-primary"><i className="ti ti-layout-dashboard" style={{ fontSize: 14 }} />Open Dashboard</a>
            </div>
          </div>
        </div>
      </section>

      {/* SCORE CARDS */}
      <section className="score-row">
        <div className="container score-grid">

          <div className="score-card">
            <div className="score-card-head"><span><i className="ti ti-certificate" style={{ color: 'var(--purple-light)' }} />Authenticity Score</span></div>
            <div className="ring-wrap">
              <div className="ring">
                <svg width="88" height="88"><circle cx="44" cy="44" r="38" stroke="rgba(255,255,255,0.07)" strokeWidth="8" fill="none" /><circle cx="44" cy="44" r="38" stroke="#F0594F" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray="238.7" strokeDashoffset={238.7 - (238.7 * (analysisResult?.scores.authenticityScore || 0) / 100)} /></svg>
                <div className="ring-num">{analysisResult?.scores.authenticityScore || 0}%</div>
              </div>
              <div className="ring-label">
                <strong>{analysisResult?.scores.authenticityScore || 0}% authentic</strong>
                <span>{analysisResult?.scores.authenticityScore ? 'Analysis complete' : 'Awaiting analysis'}</span>
                <span className={`badge ${analysisResult?.scores.authenticityScore && analysisResult.scores.authenticityScore < 50 ? 'badge-red' : analysisResult?.scores.authenticityScore && analysisResult.scores.authenticityScore < 70 ? 'badge-orange' : 'badge-teal'}`}>{analysisResult?.scores.authenticityScore ? (analysisResult.scores.authenticityScore < 50 ? 'Low authenticity' : analysisResult.scores.authenticityScore < 70 ? 'Medium authenticity' : 'High authenticity') : 'Not analyzed'}</span>
              </div>
            </div>
          </div>

          <div className="score-card">
            <div className="score-card-head"><span><i className="ti ti-target-arrow" style={{ color: 'var(--blue-accent)' }} />Confidence Score</span></div>
            <div className="ring-wrap">
              <div className="ring">
                <svg width="88" height="88"><circle cx="44" cy="44" r="38" stroke="rgba(255,255,255,0.07)" strokeWidth="8" fill="none" /><circle cx="44" cy="44" r="38" stroke="#3B82F6" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray="238.7" strokeDashoffset={238.7 - (238.7 * (analysisResult?.scores.confidenceScore || 0) / 100)} /></svg>
                <div className="ring-num">{analysisResult?.scores.confidenceScore || 0}%</div>
              </div>
              <div className="ring-label">
                <strong>{analysisResult?.scores.confidenceScore || 0}% model confidence</strong>
                <span>{analysisResult?.scores.confidenceScore ? 'Analysis complete' : 'Awaiting analysis'}</span>
                <span className={`badge ${analysisResult?.scores.confidenceScore && analysisResult.scores.confidenceScore < 70 ? 'badge-orange' : 'badge-teal'}`}>{analysisResult?.scores.confidenceScore ? (analysisResult.scores.confidenceScore < 70 ? 'Medium confidence' : 'High confidence') : 'Not analyzed'}</span>
              </div>
            </div>
          </div>

          <div className="score-card">
            <div className="score-card-head"><span><i className="ti ti-shield-exclamation" style={{ color: 'var(--orange-accent)' }} />Risk Level</span></div>
            <div className="ring-wrap">
              <div className="ring">
                <svg width="88" height="88"><circle cx="44" cy="44" r="38" stroke="rgba(255,255,255,0.07)" strokeWidth="8" fill="none" /><circle cx="44" cy="44" r="38" stroke="#F0934A" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray="238.7" strokeDashoffset={238.7 - (238.7 * (analysisResult?.scores.riskScore || 0) / 100)} /></svg>
                <div className="ring-num"><i className="ti ti-flame" style={{ fontSize: 26, color: 'var(--orange-accent)' }} /></div>
              </div>
              <div className="ring-label">
                <strong>{analysisResult?.riskAssessment.level || 'low'} risk</strong>
                <span>{analysisResult?.riskAssessment.recommendedAction || 'Awaiting analysis'}</span>
                <span className={`badge ${analysisResult?.riskAssessment.level === 'high' ? 'badge-red' : analysisResult?.riskAssessment.level === 'medium' ? 'badge-orange' : 'badge-teal'}`}>{analysisResult?.riskAssessment.level ? (analysisResult.riskAssessment.level === 'high' ? 'High risk' : analysisResult.riskAssessment.level === 'medium' ? 'Medium risk' : 'Low risk') : 'Not analyzed'}</span>
              </div>
            </div>
          </div>

          <div className="score-card">
            <div className="score-card-head"><span><i className="ti ti-face-id" style={{ color: 'var(--purple-light)' }} />Face Analysis</span></div>
            <div className="ring-wrap">
              <div className="ring">
                <svg width="88" height="88"><circle cx="44" cy="44" r="38" stroke="rgba(255,255,255,0.07)" strokeWidth="8" fill="none" /><circle cx="44" cy="44" r="38" stroke={uploadResponse?.face_found ? '#14C8A8' : '#F0934A'} strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray="238.7" strokeDashoffset={uploadResponse?.face_found ? 0 : 238.7} /></svg>
                <div className="ring-num"><i className="ti ti-face-id" style={{ fontSize: 26, color: uploadResponse?.face_found ? '#14C8A8' : '#F0934A' }} /></div>
              </div>
              <div className="ring-label">
                <strong>Face Found: {uploadResponse?.face_found ? 'Yes' : 'No'}</strong>
                <span>Faces Detected: {uploadResponse?.faces_detected ?? 0}</span>
                {(() => {
                  const faceCount = uploadResponse?.faces_detected ?? 0;
                  if (faceCount > 1) {
                    return <span>Group image detected</span>;
                  } else if (faceCount === 1) {
                    return <span>Single face detected</span>;
                  } else {
                    return <span>No recognizable human faces were found.</span>;
                  }
                })()}
                <span className={`badge ${uploadResponse?.faces_detected && uploadResponse.faces_detected > 0 ? 'badge-teal' : 'badge-orange'}`}>{uploadResponse?.faces_detected && uploadResponse.faces_detected > 0 ? 'Faces detected' : 'No faces detected'}</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* AI SAFETY ASSISTANT */}
      {uploadResponse?.success && uploadResponse.riskLevel && (
        <section className="ds-section">
          <div className="container">
            <AISafetyAssistant 
              riskLevel={uploadResponse.riskLevel} 
              analysisType="deepfake"
              findings={uploadResponse}
            />
          </div>
        </section>
      )}

      {/* AI ATTENTION HEATMAP */}
      {uploadResponse?.success && heatmapGenerated && heatmapUrl && (
        <section className="ds-section">
          <div className="container">
            <div className="section-head-row">
              <div>
                <h2><i className="ti ti-flame" />AI Attention Heatmap</h2>
                <p>The highlighted regions indicate areas the AI model considered most influential when determining authenticity.</p>
              </div>
            </div>

            <div className="twocol">
              <div>
                <div className="panel" style={{ padding: '16px' }}>
                  <div style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600', color: '#fff' }}>Original Image</div>
                  <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={imagePreviewUrl || ''} 
                      alt="Original uploaded image" 
                      style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '400px', objectFit: 'contain' }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="panel" style={{ padding: '16px' }}>
                  <div style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600', color: '#fff' }}>Grad-CAM Heatmap</div>
                  <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={heatmapUrl} 
                      alt="Grad-CAM heatmap visualization" 
                      style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '400px', objectFit: 'contain' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* DETECTED FACES */}
      {uploadResponse?.success && faceBoxes && faceBoxes.length > 0 && (
        <section className="ds-section" style={{ marginTop: '80px', paddingTop: '32px' }}>
          <div className="container">
            <div className="section-head-row">
              <div>
                <h2><i className="ti ti-face-id" />Detected Faces</h2>
                <p>Facial regions identified in the uploaded image for analysis.</p>
              </div>
            </div>

            <div className="panel" style={{ padding: '24px' }}>
              <FaceDetectionOverlay 
                imageUrl={imagePreviewUrl} 
                faceBoxes={faceBoxes}
              />
            </div>
          </div>
        </section>
      )}

      {/* FULL RESOLUTION MODAL */}
      {isModalOpen && imagePreviewUrl && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            style={{ 
              position: 'relative', 
              maxWidth: '90vw', 
              maxHeight: '90vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={imagePreviewUrl} 
              alt="Full resolution image" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '90vh',
                objectFit: 'contain',
                borderRadius: '8px'
              }}
            />
            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px'
              }}
            >
              <i className="ti ti-x" />
            </button>
          </div>
        </div>
      )}

      {/* FACE DETECTION + GRAD-CAM */}
      <section className="ds-section">
        <div className="container">
          <div className="section-head-row">
            <div>
              <h2><i className="ti ti-flame" />Grad-CAM heatmap &amp; face analysis</h2>
              <p>Visual proof of exactly which regions triggered the model&apos;s decision.</p>
            </div>
            <span className="tab-link">View full resolution <i className="ti ti-arrow-right" /></span>
          </div>

          <div className="twocol">
            <div>
              <div className="heatmap-frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreviewUrl || 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=700&h=520&fit=crop'} alt="Grad-CAM heatmap over the analyzed face" />
                <div className="heatmap-overlay" />
              </div>
              <div className="heatmap-legend">
                <div className="legend-item"><span className="legend-swatch" style={{ background: '#F0594F' }} />High activation</div>
                <div className="legend-item"><span className="legend-swatch" style={{ background: '#F0934A' }} />Medium activation</div>
                <div className="legend-item"><span className="legend-swatch" style={{ background: '#14C8A8' }} />Low activation</div>
              </div>
            </div>

            <div className="face-list">
              {uploadResponse?.face_found ? (
                <div style={{
                  padding: '20px',
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid #8B5CF6',
                  borderRadius: '12px'
                }}>
                  <h3 style={{ 
                    fontSize: '16px', 
                    fontWeight: '700', 
                    color: '#fff', 
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <i className="ti ti-face-id" style={{ color: '#8B5CF6' }} />
                    Face Analysis Summary
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#14C8A8', fontSize: '14px' }}>
                      <i className="ti ti-check" />
                      <span>Face Detection Active</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#14C8A8', fontSize: '14px' }}>
                      <i className="ti ti-check" />
                      <span>Faces Detected: {uploadResponse?.faces_detected || 0}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#14C8A8', fontSize: '14px' }}>
                      <i className="ti ti-check" />
                      <span>{(uploadResponse?.faces_detected || 0) > 1 ? 'Group Image Detected' : 'Single Face Detected'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#14C8A8', fontSize: '14px' }}>
                      <i className="ti ti-check" />
                      <span>Analysis Complete</span>
                    </div>
                  </div>
                  <div style={{ 
                    marginTop: '16px', 
                    padding: '12px', 
                    background: 'rgba(255,255,255,0.05)', 
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#ccc',
                    lineHeight: '1.5'
                  }}>
                    <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>Risk Context:</strong>
                    Faces identified successfully and included in authenticity analysis.
                  </div>
                </div>
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                  <i className="ti ti-face-id" style={{ fontSize: 32, marginBottom: 8 }} />
                  <p>No faces detected in uploaded image</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* AI ARTIFACTS + METADATA */}
      <section className="ds-section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head-row">
            <div>
              <h2><i className="ti ti-binary" />AI artifact detection &amp; metadata</h2>
              <p>Pixel-level forensics and file-level evidence, side by side.</p>
            </div>
          </div>

          <div className="twocol">
            <div className="panel" style={{ padding: 24 }}>
              <div className="panel-head" style={{ marginBottom: 16 }}><h3 style={{ fontSize: 14 }}><i className="ti ti-binary" />AI artifact signals</h3></div>
              <div className="artifact-grid">
                {analysisResult?.artifactAnalysis.map((artifact) => (
                  <div key={artifact.id} className={`artifact-card ${artifact.detected ? 'artifact-detected' : 'artifact-clear'}`}>
                    <div className="artifact-icon"><i className="ti ti-grid-dots" /></div>
                    <div className="artifact-text"><strong>{artifact.name}</strong><span>{artifact.description}</span></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel" style={{ padding: 24 }}>
              <div className="panel-head" style={{ marginBottom: 8 }}><h3 style={{ fontSize: 14 }}><i className="ti ti-file-info" />Metadata analysis</h3></div>
              <table className="meta-table">
                <tbody>
                  <tr><td>File name</td><td>{analysisResult?.metadataAnalysis.fileName || 'Not Available'}</td></tr>
                  <tr><td>Created</td><td>{analysisResult?.metadataAnalysis.created || 'Not Available'}</td></tr>
                  <tr><td>Modified</td><td className={analysisResult?.metadataAnalysis.modifiedFlagged ? 'meta-flag' : ''}>{analysisResult?.metadataAnalysis.modified || 'Not Available'} {analysisResult?.metadataAnalysis.modifiedFlagged && '⚠'}</td></tr>
                  <tr><td>Editing software</td><td className={analysisResult?.metadataAnalysis.editingSoftwareFlagged ? 'meta-flag' : ''}>{analysisResult?.metadataAnalysis.editingSoftware || 'Not Available'} {analysisResult?.metadataAnalysis.editingSoftwareFlagged && '⚠'}</td></tr>
                  <tr><td>Camera model</td><td>{analysisResult?.metadataAnalysis.cameraModel || 'Not Available'}</td></tr>
                  <tr><td>Device manufacturer</td><td>{analysisResult?.metadataAnalysis.exifMetadata?.deviceManufacturer || 'Not Available'}</td></tr>
                  <tr><td>GPS coordinates</td><td>{analysisResult?.metadataAnalysis.gpsData || 'Not Available'}</td></tr>
                  <tr><td>Resolution</td><td>{analysisResult?.metadataAnalysis.resolution || 'Not Available'}</td></tr>
                  <tr><td>File hash (SHA-256)</td><td>{analysisResult?.metadataAnalysis.fileHash || 'Not Available'}</td></tr>
                  {analysisResult?.metadataAnalysis.imageMetadata && (
                    <>
                      <tr><td>Width</td><td>{analysisResult.metadataAnalysis.imageMetadata.width}px</td></tr>
                      <tr><td>Height</td><td>{analysisResult.metadataAnalysis.imageMetadata.height}px</td></tr>
                      <tr><td>Format</td><td>{analysisResult.metadataAnalysis.imageMetadata.format}</td></tr>
                      <tr><td>Channels</td><td>{analysisResult.metadataAnalysis.imageMetadata.channels}</td></tr>
                      <tr><td>Color space</td><td>{analysisResult.metadataAnalysis.imageMetadata.colorSpace}</td></tr>
                      <tr><td>Density</td><td>{analysisResult.metadataAnalysis.imageMetadata.density}</td></tr>
                    </>
                  )}
                  {analysisResult?.metadataAnalysis.videoMetadata && (
                    <>
                      <tr><td>Duration</td><td>{analysisResult.metadataAnalysis.videoMetadata.duration}s</td></tr>
                      <tr><td>Video format</td><td>{analysisResult.metadataAnalysis.videoMetadata.format}</td></tr>
                    </>
                  )}
                  {analysisResult?.metadataAnalysis.metadataError && (
                    <tr><td colSpan={2} style={{ color: '#F0594F' }}>Metadata error: {analysisResult.metadataAnalysis.metadataError}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* EXPLAINABLE AI REPORT */}
      <section className="ds-section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head-row">
            <div>
              <h2><i className="ti ti-message-report" />Explainable AI report</h2>
              <p>In plain language — why the model reached this verdict, ranked by impact.</p>
            </div>
          </div>

          <div className="report-panel">
            <div className="report-list">
              {analysisResult?.explainableFindings.map((finding) => (
                <div key={finding.rank} className="report-item">
                  <div className="report-num">{String(finding.rank).padStart(2, '0')}</div>
                  <div className="report-text"><strong>{finding.title}</strong><p>{finding.description}</p></div>
                  <div className="report-weight">Impact: {finding.impact}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ANALYSIS HISTORY */}
      <section className="ds-section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head-row">
            <div>
              <h2><i className="ti ti-history" />Analysis history</h2>
              <p>Your past scans, available anytime from your dashboard.</p>
            </div>
            <span className="tab-link">View all <i className="ti ti-arrow-right" /></span>
          </div>

          <div className="panel" style={{ padding: '8px 28px 20px' }}>
            <table className="history-table">
              <thead>
                <tr><th>File</th><th>Date</th><th>Authenticity</th><th>Risk</th><th>Report</th></tr>
              </thead>
              <tbody>
                {historyData.map((record, index) => (
                  <tr key={record.id || index}>
                    <td><div className="file-cell"><div className="file-icon"><i className="ti ti-photo" /></div><div><strong>{record.filename}</strong><span>{record.fileSize || 'Unknown'}</span></div></div></td>
                    <td>{new Date(record.upload_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td><span className={`badge ${record.authenticity_score < 50 ? 'badge-red' : record.authenticity_score < 70 ? 'badge-orange' : 'badge-teal'}`}>{record.authenticity_score}% authentic</span></td>
                    <td><span className={`badge ${record.risk_level === 'high' ? 'badge-orange' : record.risk_level === 'medium' ? 'badge-orange' : ''}`} style={record.risk_level === 'low' ? { background: 'rgba(20,200,168,0.15)', color: '#5EEAD0' } : undefined}>{record.risk_level.charAt(0).toUpperCase() + record.risk_level.slice(1)}</span></td>
                    <td><span className="dl-btn" onClick={() => handleHistoryDownload(record)} style={{ cursor: 'pointer' }}><i className="ti ti-download" />PDF</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-final">
        <div className="container">
          <div className="cta-box">
            <h2>Ready to verify your own content?</h2>
            <p>Upload an image or video above, or explore the other three detection modules.</p>
            <div className="cta-box-actions">
              <Link href="/features" className="btn-outline btn-lg">Explore all features</Link>
              <a className="btn-primary btn-lg"><i className="ti ti-upload" style={{ fontSize: 14 }} />Upload &amp; scan now</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
