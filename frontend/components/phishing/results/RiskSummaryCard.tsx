'use client';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export default function RiskSummaryCard() {
  const handleDelete = () => {
    console.log('Delete email action');
  };

  return (
    <div className="risk-summary-card">
      <div className="risk-summary-inner">
        <div className="risk-left">
          <div className="risk-icon">
            <ShieldAlert size={48} />
          </div>
          <div className="risk-status">
            <strong>Likely Phishing</strong>
            <span>This email shows strong signs of a phishing attempt.</span>
          </div>
        </div>
        <div className="risk-right">
          <div className="risk-score-label">Risk Score</div>
          <div className="risk-score">92%</div>
          <div className="risk-progress-track">
            <div className="risk-progress-fill" style={{ width: '92%' }} />
          </div>
          <div className="risk-progress-labels">
            <span>Safe</span>
            <span>Risky</span>
          </div>
        </div>
      </div>
      <div className="risk-actions">
        <Link href="/phishing" className="btn-outline">
          Analyze Another
        </Link>
        <button className="btn-danger" onClick={handleDelete}>
          Delete Email
        </button>
      </div>
    </div>
  );
}
