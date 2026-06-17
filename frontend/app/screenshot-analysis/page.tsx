'use client';

import { useState } from 'react';
import Link from 'next/link';
import AnalysisCard from '@/components/screenshot-analysis/AnalysisCard';
import './screenshot-analysis.css';

export default function ScreenshotAnalysisPage() {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleImageUpload = (imageData: string) => {
    setUploadedImage(imageData);
  };

  return (
    <>
      <div className="crumb-bar">
        <div className="container">
          <div className="crumb">
            <Link href="/">Home</Link>
            <i className="ti ti-chevron-right" />
            <span className="current">Screenshot Analysis</span>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <div className="hero-icon-badge"><i className="ti ti-photo-scan" /></div>
            <div className="eyebrow-pill"><span className="dot" />MODULE 03 · SCREENSHOT ANALYSIS</div>
            <h1 className="h-title">Screenshot Analysis</h1>
            <p className="hero-sub">Upload a screenshot and we'll analyze it for scams, phishing attempts, and suspicious content.</p>
          </div>
        </div>
      </section>

      {/* ANALYSIS CARD */}
      <section className="analysis-section">
        <div className="container">
          <AnalysisCard 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            onImageUpload={handleImageUpload}
            uploadedImage={uploadedImage}
          />
        </div>
      </section>
    </>
  );
}
