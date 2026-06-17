'use client';
import { ChevronDown } from 'lucide-react';

export default function AIExplanationCard() {
  return (
    <div className="ai-explanation-card">
      <div className="ai-explanation-content">
        <h3>Why TrustShield AI Flagged This</h3>
        <p>The sender is impersonating a trusted brand and using urgency and fear tactics to trick users.</p>
        <p>The domain uses look-alike characters and does not match the legitimate organization's official domain.</p>
      </div>
      <div className="ai-explanation-action">
        <button className="show-details-btn">
          Show Details <ChevronDown size={16} />
        </button>
      </div>
    </div>
  );
}
