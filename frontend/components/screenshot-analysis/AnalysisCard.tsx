'use client';
import { useState } from 'react';
import { Image, ClipboardCopy, Lock, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import UploadArea from './UploadArea';
import SupportedSources from './SupportedSources';
import { ScreenshotAnalysisResponse } from '@/types/screenshot';

type TabType = 'upload' | 'paste';

interface AnalysisCardProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onImageUpload: (imageData: string) => void;
  uploadedImage: string | null;
  uploadedFile: File | null;
  onFileUpload: (file: File) => void;
}

export default function AnalysisCard({
  activeTab,
  onTabChange,
  onImageUpload,
  uploadedImage,
  uploadedFile,
  onFileUpload,
}: AnalysisCardProps) {
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!uploadedFile) {
      setAnalysisError('Please upload a screenshot first');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);

      const response = await fetch('/api/screenshot/analyze', {
        method: 'POST',
        body: formData,
      });

      const data: ScreenshotAnalysisResponse =
        await response.json();

      if (data.success) {
        sessionStorage.setItem(
          'screenshotAnalysisResults',
          JSON.stringify(data)
        );

        sessionStorage.setItem(
          'screenshotPreview',
          uploadedImage || ''
        );

        router.push(
          '/screenshot-analysis/results'
        );
      } else {
        setAnalysisError(
          data.error ||
            'Analysis failed. Please try again.'
        );
      }
    } catch (error) {
      console.error('Analysis error:', error);

      setAnalysisError(
        'Failed to analyze screenshot. Please ensure the backend is running.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const hasInput = uploadedImage !== null;

  return (
    <div className="analysis-card">
      <div className="tab-container">
        <button
          className={`tab-button ${
            activeTab === 'upload'
              ? 'tab-active'
              : 'tab-inactive'
          }`}
          onClick={() => onTabChange('upload')}
        >
          <Image className="tab-icon" size={18} />
          <span>Upload Screenshot</span>
        </button>

        <button
          className={`tab-button ${
            activeTab === 'paste'
              ? 'tab-active'
              : 'tab-inactive'
          }`}
          onClick={() => onTabChange('paste')}
          disabled
        >
          <ClipboardCopy
            className="tab-icon"
            size={18}
          />
          <span>
            Paste Image{' '}
            <span className="coming-soon">
              (Coming Soon)
            </span>
          </span>
        </button>
      </div>

      {activeTab === 'upload' && (
        <>
          <UploadArea
            onImageUpload={onImageUpload}
            onFileUpload={onFileUpload}
          />

          {analysisError && (
            <div
              style={{
                marginTop: '16px',
                padding: '12px',
                borderRadius: '8px',
                background:
                  'rgba(240, 89, 79, 0.15)',
                border:
                  '1px solid #F0594F',
                color: '#F0594F',
                fontSize: '14px',
              }}
            >
              {analysisError}
            </div>
          )}

          <div className="action-row">
            <button
              className="btn-primary btn-lg"
              disabled={
                !hasInput || isAnalyzing
              }
              onClick={handleAnalyze}
              style={{
                opacity:
                  isAnalyzing ? 0.7 : 1,
              }}
            >
              {isAnalyzing
                ? 'Analyzing...'
                : 'Analyze Screenshot'}{' '}
              <ArrowRight size={16} />
            </button>

            <div className="privacy-note">
              <Lock size={14} />
              <span>
                Your privacy is our priority.
                We do not store or share your
                data.
              </span>
            </div>
          </div>

          <SupportedSources />
        </>
      )}
    </div>
  );
}