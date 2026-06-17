'use client';
import { AlertTriangle, ShieldAlert, Lock, Link as LinkIcon } from 'lucide-react';

export default function FlagReasons() {
  const reasons = [
    {
      icon: AlertTriangle,
      title: 'Creates urgency',
      description: 'Uses time-sensitive language to pressure quick action',
    },
    {
      icon: ShieldAlert,
      title: 'Threatens account suspension',
      description: 'Claims account will be suspended without immediate action',
    },
    {
      icon: Lock,
      title: 'Requests account verification',
      description: 'Asks for sensitive information to verify identity',
    },
    {
      icon: LinkIcon,
      title: 'Uses suspicious website link',
      description: 'Contains a link that doesn\'t match the official domain',
    },
  ];

  return (
    <div className="flag-reasons-card">
      <h3>Why We Flagged This</h3>
      <div className="flag-reasons-grid">
        {reasons.map((reason, index) => (
          <div key={index} className="flag-reason-item">
            <div className="flag-reason-icon">
              <reason.icon size={20} />
            </div>
            <div className="flag-reason-content">
              <strong>{reason.title}</strong>
              <span>{reason.description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
