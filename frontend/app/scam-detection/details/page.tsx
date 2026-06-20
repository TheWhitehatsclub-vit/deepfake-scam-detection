'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import './details.css';

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
  };
}

const riskLabel = (status: string) => {
  if (status === 'danger') return 'High Risk';
  if (status === 'warning') return 'Medium Risk';
  return 'Low Risk';
};

export default function ScamDetailsPage() {
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

  const { url, domain, trust_score, checks } = result;

  const websiteInfo = [
    { label: 'URL', value: url },
    { label: 'Domain', value: domain },
    { label: 'Domain Age', value: checks.domain_age.details },
    { label: 'SSL Status', value: checks.ssl_certificate.details },
  ];

  const summaryItems = [
    { label: 'Domain Age', risk: riskLabel(checks.domain_age.status) },
    { label: 'SSL Certificate', risk: riskLabel(checks.ssl_certificate.status) },
    { label: 'URL Structure', risk: riskLabel(checks.url_structure.status) },
    { label: 'Brand Similarity', risk: riskLabel(checks.brand_similarity.status) },
    { label: 'Suspicious Keywords', risk: riskLabel(checks.suspicious_keywords.status) },
    { label: 'Reputation Check', risk: riskLabel(checks.reputation.status) },
    { label: 'Trust Score', risk: `${trust_score}/100` },
  ];

  const allChecks = [
    { name: 'Domain Age Analysis', result: checks.domain_age.details, risk: riskLabel(checks.domain_age.status) },
    { name: 'SSL Certificate Verification', result: checks.ssl_certificate.details, risk: riskLabel(checks.ssl_certificate.status) },
    { name: 'URL Structure Analysis', result: checks.url_structure.details, risk: riskLabel(checks.url_structure.status) },
    { name: 'Brand Similarity Detection', result: checks.brand_similarity.details, risk: riskLabel(checks.brand_similarity.status) },
    { name: 'Suspicious Keyword Detection', result: checks.suspicious_keywords.details, risk: riskLabel(checks.suspicious_keywords.status) },
    { name: 'Reputation Analysis', result: checks.reputation.details, risk: riskLabel(checks.reputation.status) },
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

      <section className="details-header">
        <div className="container">
          <h1 className="h-title">Detailed Analysis</h1>
          <p className="header-sub">In-depth breakdown of all security checks.</p>
        </div>
      </section>

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