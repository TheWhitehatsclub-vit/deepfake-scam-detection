'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShieldAlert, ShieldCheck, ShieldQuestion, Share2, AlertTriangle, Ban, Tag, Lock, FileText, Brain, Clock, FileWarning } from 'lucide-react';
import './results.css';

interface CheckResult {
  score: number;
  status: string;
  details: string;
}

interface ScamResult {
  url: string;
  domain: string;
  trust_score: number;
  overall_status: string;
  checks: {
    domain_age: CheckResult;
    ssl_certificate: CheckResult;
    url_structure: CheckResult;
    brand_similarity: CheckResult;
    suspicious_keywords: CheckResult;
    reputation: CheckResult;
    content_analysis?: CheckResult;
  };
}

export default function ScamResultsPage() {
  const [result, setResult] = useState<ScamResult | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('scam_result');
    if (raw) setResult(JSON.parse(raw));
  }, []);

  if (!result) {
    return (
      <div className="container" style={{ padding: '2rem' }}>
        <p>No results found. <Link href="/scam-detection">Run a new scan.</Link></p>
      </div>
    );
  }

  const { trust_score, overall_status, checks, url } = result;

  const riskConfig = {
    safe:    { label: 'Safe',         sub: 'This website appears legitimate and safe to visit.',                          Icon: ShieldCheck   },
    warning: { label: 'Suspicious',   sub: 'This website has some concerning signals. Proceed with caution.',             Icon: ShieldQuestion },
    danger:  { label: 'High Risk',    sub: 'This website shows strong signs of scam, phishing, or malicious activity.',   Icon: ShieldAlert   },
  }[overall_status] ?? { label: 'Unknown', sub: '', Icon: ShieldQuestion };

  const iconFor = (key: string) => {
    if (key === 'ssl_certificate') return Lock;
    if (key === 'domain_age') return Clock;
    if (key === 'brand_similarity') return Ban;
    if (key === 'content_analysis') return FileWarning;
    return Tag;
  };

  const indicators = Object.entries(checks)
    .filter(([, v]) => v && v.status !== 'safe')
    .map(([key, v]) => ({
      icon: iconFor(key),
      label: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      description: v!.details,
    }));

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

      <section className="results-header">
        <div className="container header-inner">
          <div className="header-left">
            <h1 className="h-title">Analysis Complete</h1>
            <p className="header-sub">Results for: <strong>{url}</strong></p>
          </div>
          <div className="header-right">
            <div className="time-badge">
              <i className="ti ti-clock" />
              <span>Analyzed just now</span>
            </div>
          </div>
        </div>
      </section>

      <section className="risk-section">
        <div className="container">
          <div className={`risk-summary-card status-${overall_status}`}>
            <div className="risk-summary-inner">
              <div className="risk-left">
                <div className="risk-icon">
                  <riskConfig.Icon size={48} />
                </div>
                <div className="risk-status">
                  <strong>{riskConfig.label}</strong>
                  <span>{riskConfig.sub}</span>
                </div>
              </div>
              <div className="risk-right">
                <div className="risk-score-label">Trust Score</div>
                <div className="risk-score">{trust_score}/100</div>
                <div className="risk-progress-track">
                  <div className="risk-progress-fill" style={{ width: `${trust_score}%` }} />
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
              <button className="btn-outline" onClick={() => navigator.clipboard?.writeText(url)}>
                <Share2 size={16} />
                Share Result
              </button>
            </div>
          </div>
        </div>
      </section>

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

      {indicators.length > 0 && (
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
      )}
    </>
  );
}