'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, ShieldAlert, ShieldQuestion } from 'lucide-react';
import './explanation.css';

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
  explanation: string;
  checks: {
    domain_age: CheckResult;
    ssl_certificate: CheckResult;
    url_structure: CheckResult;
    brand_similarity: CheckResult;
    suspicious_keywords: CheckResult;
    reputation: CheckResult;
  };
}

const recConfig = {
  safe: {
    Icon: ShieldCheck,
    line1: 'This website appears safe to use.',
    line2: 'Standard caution still applies when entering personal information online.',
  },
  warning: {
    Icon: ShieldQuestion,
    line1: 'Proceed with caution on this website.',
    line2: 'Avoid entering sensitive details like passwords, OTPs, or payment information unless you trust the source.',
  },
  danger: {
    Icon: ShieldAlert,
    line1: 'We strongly recommend avoiding this website.',
    line2: 'Do not enter personal information, passwords, OTPs, or payment details.',
  },
};

export default function ScamExplanationPage() {
  const [result, setResult] = useState<ScamResult | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('scam_result');
    if (raw) setResult(JSON.parse(raw));
  }, []);

  if (!result) {
    return (
      <div className="container" style={{ padding: '2rem' }}>
        <p>No analysis found. <Link href="/scam-detection">Run a new scan.</Link></p>
      </div>
    );
  }

  const { checks, overall_status, explanation } = result;

  // build key reasons from checks that aren't "safe"
  const reasons = Object.values(checks)
    .filter((c) => c.status !== 'safe')
    .map((c) => c.details);

  const rec = recConfig[overall_status as keyof typeof recConfig] ?? recConfig.warning;

  return (
    <>
      <div className="crumb-bar">
        <div className="container">
          <div className="crumb">
            <Link href="/scam-detection/results" className="back-link">
              <i className="ti ti-arrow-left" /> Back to Results
            </Link>
          </div>
        </div>
      </div>

      <section className="explanation-header">
        <div className="container">
          <h1 className="h-title">AI Analysis & Explanation</h1>
          <p className="header-sub">Our AI model has analyzed this website and generated the following insights.</p>
        </div>
      </section>

      <section className="summary-section">
        <div className="container">
          <div className="ai-summary-card">
            <h3>AI Summary</h3>
            <p className="ai-text">{explanation}</p>
          </div>
        </div>
      </section>

      {reasons.length > 0 && (
        <section className="reasons-section">
          <div className="container">
            <div className="reasons-card">
              <h3>Key Reasons</h3>
              <ol className="reasons-list">
                {reasons.map((reason, index) => (
                  <li key={index}>{reason}</li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      )}

      <section className="recommendation-section">
        <div className="container">
          <div className="recommendation-card">
            <div className="recommendation-icon">
              <rec.Icon size={24} />
            </div>
            <div className="recommendation-content">
              <h3>Recommendation</h3>
              <p>{rec.line1}</p>
              <p>{rec.line2}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}