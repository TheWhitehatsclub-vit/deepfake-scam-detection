'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import InputMethodTabs from '@/components/phishing/InputMethodTabs';
import UploadArea from '@/components/phishing/UploadArea';
import TextInputAnalyzer from '@/components/phishing/TextInputAnalyzer';
import WhatWeAnalyze from '@/components/phishing/WhatWeAnalyze';
import './phishing.css';

export default function PhishingDetectionPage() {
  const router = useRouter();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'text'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResponse, setUploadResponse] = useState<any>(null);

  const hasInput = uploadedImage !== null || text.length > 0;

  const handleAnalyze = async () => {
    if (hasInput && selectedFile) {
      setIsUploading(true);
      setUploadResponse(null);

      try {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const response = await fetch('/api/deepfake/analyze', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        setUploadResponse(data);

        if (data.success) {
          router.push('/phishing/results');
        }
      } catch (error) {
        console.error('Upload error:', error);
        setUploadResponse({ success: false, error: 'Failed to upload file' });
      } finally {
        setIsUploading(false);
      }
    } else if (hasInput) {
      router.push('/phishing/results');
    }
  };

  return (
    <>
      <div className="crumb-bar">
        <div className="container">
          <div className="crumb">
            <Link href="/">Home</Link>
            <i className="ti ti-chevron-right" />
            <span className="current">Phishing Analysis</span>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <div className="hero-icon-badge"><i className="ti ti-mail-check" /></div>
            <div className="eyebrow-pill"><span className="dot" />MODULE 02 · PHISHING DETECTION</div>
            <h1 className="h-title">Phishing Analysis</h1>
            <p className="hero-sub">Upload an email screenshot or paste the message text and we'll analyze it for phishing threats.</p>
          </div>
        </div>
      </section>

      {/* TAB SELECTOR */}
      <section className="tabs-section">
        <div className="container">
          <InputMethodTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </section>

      {/* UPLOAD AREA */}
      <section className="upload-section">
        <div className="container">
          {activeTab === 'upload' && (
            <UploadArea onImageUpload={setUploadedImage} onFileSelect={setSelectedFile} />
          )}
          {activeTab === 'text' && (
            <TextInputAnalyzer onTextChange={setText} />
          )}
          
          <div className="action-row">
            <button className="btn-primary btn-lg" disabled={!hasInput || isUploading} onClick={handleAnalyze}>
              {isUploading ? 'Uploading...' : 'Analyze Message'} <i className="ti ti-arrow-right" style={{ fontSize: 14 }} />
            </button>
            <div className="privacy-note">
              <i className="ti ti-lock" style={{ fontSize: 14 }} />
              <span>Your data is private and never stored.</span>
            </div>
          </div>

          {uploadResponse && (
            <div className="upload-response">
              {uploadResponse.success ? (
                <div className="upload-response-success">
                  <div>File uploaded successfully!</div>
                  <div>File: {uploadResponse.fileName}</div>
                  <div>Type: {uploadResponse.fileType}</div>
                  <div>Size: {uploadResponse.fileSize} bytes</div>
                </div>
              ) : (
                <div className="upload-response-error">
                  Error: {uploadResponse.error}
                </div>
              )}
            </div>
          )}

          <WhatWeAnalyze />
        </div>
      </section>
    </>
  );
}
