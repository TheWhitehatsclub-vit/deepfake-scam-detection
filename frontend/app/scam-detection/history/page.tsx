'use client';

import Link from 'next/link';
import './history.css';

export default function ScamHistoryPage() {
  const history = [
    { website: 'https://amaz0n-pay-secure.xyz', trustScore: '18/100', riskLevel: 'High Risk', analyzedAt: '2 hours ago' },
    { website: 'https://free-gift-card.today', trustScore: '22/100', riskLevel: 'High Risk', analyzedAt: '5 hours ago' },
    { website: 'https://secure-login-verify.com', trustScore: '35/100', riskLevel: 'High Risk', analyzedAt: '1 day ago' },
    { website: 'https://example.com', trustScore: '85/100', riskLevel: 'Safe', analyzedAt: '2 days ago' },
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
      <section className="history-header">
        <div className="container">
          <h1 className="h-title">Scan History</h1>
          <p className="header-sub">View your previously analyzed websites.</p>
        </div>
      </section>

      {/* HISTORY TABLE */}
      <section className="history-section">
        <div className="container">
          <div className="history-card">
            <div className="history-table">
              <div className="history-header">
                <span>Website</span>
                <span>Trust Score</span>
                <span>Risk Level</span>
                <span>Analyzed At</span>
              </div>
              {history.map((item, index) => (
                <div key={index} className="history-row">
                  <span className="history-website">{item.website}</span>
                  <span className="history-score">{item.trustScore}</span>
                  <span className={`history-risk ${item.riskLevel === 'High Risk' ? 'high' : item.riskLevel === 'Safe' ? 'safe' : ''}`}>
                    {item.riskLevel}
                  </span>
                  <span className="history-date">{item.analyzedAt}</span>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            <div className="pagination">
              <button className="pagination-btn" disabled>← Previous</button>
              <div className="pagination-pages">
                <button className="pagination-page active">1</button>
                <button className="pagination-page">2</button>
                <button className="pagination-page">3</button>
              </div>
              <button className="pagination-btn">Next →</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
