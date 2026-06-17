'use client';
import { Check } from 'lucide-react';

export default function RecommendationCard() {
  const recommendations = [
    'Do not click links or attachments',
    'Do not provide passwords, OTPs, or personal information',
    'Visit the official website directly from your browser',
    'Delete this email if you\'re unsure about the sender',
  ];

  return (
    <div className="recommendation-card">
      <h3>What You Should Do</h3>
      <ul className="recommendation-list">
        {recommendations.map((rec, index) => (
          <li key={index}>
            <div className="check-icon">
              <Check size={16} />
            </div>
            <span>{rec}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
