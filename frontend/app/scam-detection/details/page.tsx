'use client';

import Link from 'next/link';
import './details.css';

export default function ScamDetailsPage() {
  const websiteInfo = [
    { label: 'URL', value: 'https://amaz0n-pay-secure.xyz' },
    { label: 'Domain', value: 'amaz0n-pay-secure.xyz' },
    { label: 'IP Address', value: '185.23.45.67' },
    { label: 'Server Location', value: 'United States' },
    { label: 'Domain Age', value: '5 Days' },
    { label: 'SSL Status', value: 'Invalid / Self-signed' },
    { label: 'HTTPS', value: 'Yes' },
  ];

  const summaryItems = [
    { label: 'Domain Age', risk: 'High Risk' },
    { label: 'SSL Certificate', risk: 'High Risk' },
    { label: 'URL Structure', risk: 'High Risk' },
    { label: 'Brand Similarity', risk: 'High Risk' },
    { label: 'Suspicious Keywords', risk: 'High Risk' },
    { label: 'Reputation Check', risk: 'High Risk' },
    { label: 'Content Analysis', risk: 'Medium Risk' },
    { label: 'Trust Score', risk: '18/100' },
  ];

  const allChecks = [
    { name: 'Domain Age Analysis', result: '5 days old', risk: 'High Risk' },
    { name: 'SSL Certificate Verification', result: 'Self-signed', risk: 'High Risk' },
    { name: 'URL Structure Analysis', result: 'Suspicious pattern', risk: 'High Risk' },
    { name: 'Brand Similarity Detection', result: 'Amazon impersonation', risk: 'High Risk' },
    { name: 'Suspicious Keyword Detection', result: 'Multiple alerts', risk: 'High Risk' },
    { name: 'Reputation Analysis', result: 'Blacklisted', risk: 'High Risk' },
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
      <section className="details-header">
        <div className="container">
          <h1 className="h-title">Detailed Analysis</h1>
          <p className="header-sub">In-depth breakdown of all security checks.</p>
        </div>
      </section>

      {/* WEBSITE INFORMATION */}
      <section className="info-section">
        <div className="container">
          <div className="info-card">
            <h3>Website Information</h3>
            <div className="info-grid">
              {websiteInfo.map((item, index) => (
                <div key={index} className="info-item">
                  <span className="info-label">{item.label}</span>
                  <span className="info-value">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SUMMARY */}
      <section className="summary-section">
        <div className="container">
          <div className="summary-card">
            <h3>Summary</h3>
            <div className="summary-grid">
              {summaryItems.map((item, index) => (
                <div key={index} className="summary-item">
                  <span className="summary-label">{item.label}</span>
                  <span className={`summary-risk ${item.risk.includes('High') ? 'high' : item.risk.includes('Medium') ? 'medium' : ''}`}>
                    {item.risk}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ALL CHECKS */}
      <section className="checks-section">
        <div className="container">
          <div className="checks-card">
            <h3>All Checks</h3>
            <div className="checks-table">
              <div className="checks-header">
                <span>Check Name</span>
                <span>Result</span>
                <span>Risk</span>
              </div>
              {allChecks.map((check, index) => (
                <div key={index} className="checks-row">
                  <span className="check-name">{check.name}</span>
                  <span className="check-result">{check.result}</span>
                  <span className={`check-risk ${check.risk.includes('High') ? 'high' : ''}`}>{check.risk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
