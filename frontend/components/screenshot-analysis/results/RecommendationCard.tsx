'use client';
import { ShieldCheck } from 'lucide-react';

export default function RecommendationCard() {
  const recommendations = [
    'Do not click on any links in this screenshot.',
    'Do not share personal or financial information.',
    'Ignore unknown prize or reward claims.',
    'Verify offers only through official sources.',
  ];

  return (
    <div className="recommendation-card">
      <div className="recommendation-icon">
        <ShieldCheck size={24} />
      </div>
      <div className="recommendation-content">
        <h3>Recommended Actions</h3>
        <ul className="recommendation-list">
          {recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
