'use client';
import { AlertTriangle, Link, Key, Eye } from 'lucide-react';

export default function WhatWeAnalyze() {
  const indicators = [
    { icon: AlertTriangle, label: 'Urgency & Threats' },
    { icon: Link, label: 'Suspicious Links' },
    { icon: Key, label: 'Credential Requests' },
    { icon: Eye, label: 'Deception Patterns' },
  ];

  return (
    <div className="what-we-analyze-card">
      <div className="what-we-analyze-header">
        <h3>What we analyze</h3>
        <p>Our AI checks for common phishing indicators like urgency, threat language, suspicious links, and credential requests.</p>
      </div>
      <div className="indicators-grid">
        {indicators.map((indicator, index) => (
          <div key={index} className="indicator-item">
            <indicator.icon size={18} className="indicator-icon" />
            <span>{indicator.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
