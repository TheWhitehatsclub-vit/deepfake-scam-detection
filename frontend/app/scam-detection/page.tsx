'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Globe, Shield, Layout, Tag } from 'lucide-react';
import './scam-detection.css';

export default function ScamDetectionPage() {
  const router = useRouter();
  const [url, setUrl] = useState('');

  const hasInput = url.length > 0;

  const handleAnalyze = () => {
    if (hasInput) {
      router.push('/scam-detection/analyzing');
    }
  };

  const categories = [
    { icon: Globe, label: 'Domain & SSL' },
    { icon: Shield, label: 'Reputation' },
    { icon: Layout, label: 'Content & Structure' },
    { icon: Tag, label: 'Brand & Keywords' },
  ];

  return (
    <>
      <div className="crumb-bar">
        <div className="container">
          <div className="crumb">
            <Link href="/" className="back-link">
              <i className="ti ti-arrow-left" /> Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <div className="hero-icon-badge"><i className="ti ti-world-check" /></div>
            <div className="eyebrow-pill"><span className="dot" />MODULE 01 · SCAM WEBSITE DETECTION</div>
            <h1 className="h-title">Scam Website Detection</h1>
            <p className="hero-sub">Enter any website URL and we'll analyze it for scams, phishing, malware, and other threats.</p>
          </div>
        </div>
      </section>

      {/* INPUT CARD */}
      <section className="input-section">
        <div className="container">
          <div className="input-card">
            <div className="input-header">
              <label className="input-label">Website URL</label>
            </div>
            <input
              type="url"
              className="url-input"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            
            <div className="action-row">
              <button className="btn-primary btn-lg" disabled={!hasInput} onClick={handleAnalyze}>
                Analyze Website <i className="ti ti-arrow-right" style={{ fontSize: 14 }} />
              </button>
              <div className="privacy-note">
                <i className="ti ti-lock" style={{ fontSize: 14 }} />
                <span>Your data is private and never stored.</span>
              </div>
            </div>
          </div>

          <div className="what-we-analyze-card">
            <div className="what-we-analyze-header">
              <h3>What we analyze</h3>
              <p>Our AI checks multiple factors to identify suspicious and malicious websites.</p>
            </div>
            <div className="indicators-grid">
              {categories.map((category, index) => (
                <div key={index} className="indicator-item">
                  <category.icon size={18} className="indicator-icon" />
                  <span>{category.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
