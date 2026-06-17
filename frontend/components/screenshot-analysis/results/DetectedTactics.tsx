'use client';
import { Clock, Gift, Link2, Heart } from 'lucide-react';

export default function DetectedTactics() {
  const tactics = [
    { icon: Clock, label: 'Urgency', description: 'Creates pressure for immediate action' },
    { icon: Gift, label: 'Reward Scam', description: 'Fake prize or reward claim detected' },
    { icon: Link2, label: 'Suspicious Link', description: 'Contains an untrusted external link' },
    { icon: Heart, label: 'Social Engineering', description: 'Uses emotional triggers to manipulate' },
  ];

  return (
    <div className="detected-tactics">
      <h3>Detected Tactics</h3>
      <div className="tactics-grid">
        {tactics.map((tactic, index) => (
          <div key={index} className="tactic-card">
            <div className="tactic-icon">
              <tactic.icon size={20} />
            </div>
            <div className="tactic-content">
              <strong>{tactic.label}</strong>
              <span>{tactic.description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
