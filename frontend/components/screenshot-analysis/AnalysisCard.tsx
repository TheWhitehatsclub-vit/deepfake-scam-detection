'use client';
import { Image, ClipboardCopy, Lock, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import UploadArea from './UploadArea';
import SupportedSources from './SupportedSources';

type TabType = 'upload' | 'paste';

interface AnalysisCardProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onImageUpload: (imageData: string) => void;
  uploadedImage: string | null;
}

export default function AnalysisCard({ activeTab, onTabChange, onImageUpload, uploadedImage }: AnalysisCardProps) {
  const router = useRouter();

  const handleAnalyze = () => {
    if (uploadedImage) {
      router.push('/screenshot-analysis/results');
    }
  };

  const hasInput = uploadedImage !== null;

  return (
    <div className="analysis-card">
      <div className="tab-container">
        <button
          className={`tab-button ${activeTab === 'upload' ? 'tab-active' : 'tab-inactive'}`}
          onClick={() => onTabChange('upload')}
        >
          <Image className="tab-icon" size={18} />
          <span>Upload Screenshot</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'paste' ? 'tab-active' : 'tab-inactive'}`}
          onClick={() => onTabChange('paste')}
          disabled
        >
          <ClipboardCopy className="tab-icon" size={18} />
          <span>Paste Image <span className="coming-soon">(Coming Soon)</span></span>
        </button>
      </div>
      {activeTab === 'upload' && (
        <>
          <UploadArea onImageUpload={onImageUpload} />
          <div className="action-row">
            <button className="btn-primary btn-lg" disabled={!hasInput} onClick={handleAnalyze}>
              Analyze Screenshot <ArrowRight size={16} />
            </button>
            <div className="privacy-note">
              <Lock size={14} />
              <span>Your privacy is our priority. We do not store or share your data.</span>
            </div>
          </div>
          <SupportedSources />
        </>
      )}
    </div>
  );
}
