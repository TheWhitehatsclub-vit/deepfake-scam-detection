'use client';

import Link from 'next/link';
import { ShieldAlert, Share2, AlertTriangle, Ban, Tag, Lock, FileText, Brain, Clock } from 'lucide-react';
import './results.css';

export default function ScamResultsPage() {
  const handleShare = () => {
    console.log('Share result action');
  };

  const indicators = [
    { icon: AlertTriangle, label: 'Low Domain Age', description: 'Domain registered recently' },
    { icon: Ban, label: 'Blacklisted', description: 'Flagged by security databases' },
    { icon: Tag, label: 'Suspicious Keywords', description: 'Phishing-related terms detected' },
    { icon: Lock, label: 'SSL Issues', description: 'Invalid or self-signed certificate' },
  ];

  return (
    <>
      <div className="crumb-bar">
        <div className="container">
          <div className="crumb">
            <Link href="/scam-detection" className="back-link">
              <i className="ti ti-arrow-left" /> Back to Analyzer
            </Link>
          </div>
        </div>
      </div>

      {/* HEADER */}
      <section className="results-header">
        <div className="container header-inner">
          <div className="header-left">
            <h1 className="h-title">Analysis Complete</h1>
            <p className="header-sub">Here's what we found about this website.</p>
          </div>
          <div className="header-right">
            <div className="time-badge">
              <i className="ti ti-clock" />
              <span>Analyzed just now</span>
            </div>
          </div>
        </div>
      </section>

      {/* RISK SUMMARY CARD */}
      <section className="risk-section">
        <div className="container">
          <div className="risk-summary-card">
            <div className="risk-summary-inner">
              <div className="risk-left">
                <div className="risk-icon">
                  <ShieldAlert size={48} />
                </div>
                <div className="risk-status">
                  <strong>High Risk</strong>
                  <span>This website shows strong signs of scam, phishing, or malicious activity.</span>
                </div>
              </div>
              <div className="risk-right">
                <div className="risk-score-label">Trust Score</div>
                <div className="risk-score">18/100</div>
                <div className="risk-progress-track">
                  <div className="risk-progress-fill" style={{ width: '18%' }} />
                </div>
                <div className="risk-progress-labels">
                  <span>Unsafe</span>
                  <span>Safe</span>
                </div>
              </div>
            </div>
            <div className="risk-actions">
              <Link href="/scam-detection" className="btn-outline">
                Scan Another Website
              </Link>
              <button className="btn-outline" onClick={handleShare}>
                <Share2 size={16} />
                Share Result
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* NAVIGATION ACTIONS */}
      <section className="nav-actions-section">
        <div className="container">
          <div className="nav-actions-grid">
            <Link href="/scam-detection/details" className="nav-action-card">
              <FileText size={24} />
              <div className="nav-action-content">
                <strong>View Detailed Analysis</strong>
                <span>See all security checks and breakdown</span>
              </div>
            </Link>
            <Link href="/scam-detection/explanation" className="nav-action-card">
              <Brain size={24} />
              <div className="nav-action-content">
                <strong>AI Explanation</strong>
                <span>Understand why this was flagged</span>
              </div>
            </Link>
            <Link href="/scam-detection/history" className="nav-action-card">
              <Clock size={24} />
              <div className="nav-action-content">
                <strong>History</strong>
                <span>View your previous scans</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* RISK INDICATORS */}
      <section className="flag-section">
        <div className="container">
          <div className="flag-reasons-card">
            <h3>Risk Indicators</h3>
            <div className="flag-reasons-grid">
              {indicators.map((indicator, index) => (
                <div key={index} className="flag-reason-item">
                  <div className="flag-reason-icon">
                    <indicator.icon size={20} />
                  </div>
                  <div className="flag-reason-content">
                    <strong>{indicator.label}</strong>
                    <span>{indicator.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
