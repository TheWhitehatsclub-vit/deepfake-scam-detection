'use client';

import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import './explanation.css';

export default function ScamExplanationPage() {
  const reasons = [
    'Domain registered recently (5 days ago)',
    'Domain name impersonates a popular brand (Amazon)',
    'Uses phishing-related keywords like "pay" and "secure"',
    'SSL certificate is invalid or self-signed',
    'Flagged by multiple security vendors',
    'Website may collect sensitive user data',
  ];

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

      {/* HEADER */}
      <section className="explanation-header">
        <div className="container">
          <h1 className="h-title">AI Analysis & Explanation</h1>
          <p className="header-sub">Our AI model has analyzed this website and generated the following insights.</p>
        </div>
      </section>

      {/* AI SUMMARY */}
      <section className="summary-section">
        <div className="container">
          <div className="ai-summary-card">
            <h3>AI Summary</h3>
            <p className="ai-text">
              This website displays multiple high-risk indicators commonly associated with phishing and scam websites.
            </p>
            <p className="ai-text">
              The domain is very new, uses brand impersonation, and has been flagged by security databases.
            </p>
            <p className="ai-text">
              It is likely related to credential theft or payment information harvesting.
            </p>
          </div>
        </div>
      </section>

      {/* KEY REASONS */}
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

      {/* RECOMMENDATION */}
      <section className="recommendation-section">
        <div className="container">
          <div className="recommendation-card">
            <div className="recommendation-icon">
              <ShieldCheck size={24} />
            </div>
            <div className="recommendation-content">
              <h3>Recommendation</h3>
              <p>We strongly recommend avoiding this website.</p>
              <p>Do not enter personal information, passwords, OTPs, or payment details.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
