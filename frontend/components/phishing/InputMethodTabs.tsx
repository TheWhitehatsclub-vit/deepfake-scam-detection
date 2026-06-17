'use client';
import { Image, FileText } from 'lucide-react';

type TabType = 'upload' | 'text';

interface InputMethodTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function InputMethodTabs({ activeTab, onTabChange }: InputMethodTabsProps) {
  return (
    <div className="tab-container">
      <button
        className={`tab-button ${activeTab === 'upload' ? 'tab-active' : 'tab-inactive'}`}
        onClick={() => onTabChange('upload')}
      >
        <Image className="tab-icon" size={18} />
        <span>Upload Screenshot</span>
      </button>
      <button
        className={`tab-button ${activeTab === 'text' ? 'tab-active' : 'tab-inactive'}`}
        onClick={() => onTabChange('text')}
      >
        <FileText className="tab-icon" size={18} />
        <span>Paste Text</span>
      </button>
    </div>
  );
}
