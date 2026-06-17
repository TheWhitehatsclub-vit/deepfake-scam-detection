'use client';
import { ShieldAlert } from 'lucide-react';

export default function RiskSummaryCard() {
  return (
    <div className="risk-summary-card">
      <div className="risk-summary-inner">
        <div className="risk-left">
          <div className="risk-icon">
            <ShieldAlert size={48} />
          </div>
          <div className="risk-status">
            <strong>Very High Risk</strong>
            <span className="probability">89% Scam Probability</span>
            <span>This screenshot contains multiple scam indicators and should be treated with caution.</span>
          </div>
        </div>
        <div className="risk-right">
          <div className="risk-meter">
            <div className="risk-meter-track">
              <div className="risk-meter-fill" style={{ width: '89%' }} />
            </div>
            <div className="risk-meter-marker" style={{ left: '89%' }} />
            <div className="risk-meter-labels">
              <span>Safe</span>
              <span>Risky</span>
              <span>Very Risky</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
