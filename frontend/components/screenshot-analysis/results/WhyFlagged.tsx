'use client';

export default function WhyFlagged() {
  const indicators = [
    { title: 'Reward Claim Scam', description: 'Promises large monetary reward to lure victims into clicking malicious links.' },
    { title: 'Urgency Tactics', description: 'Uses time pressure ("expires in 2 hours") to force quick decisions without verification.' },
    { title: 'Suspicious Domain', description: 'The URL "reward-center.xyz" is not associated with any legitimate reward program.' },
    { title: 'Impersonation', description: 'Uses generic "Reward Center" branding without proper company identification.' },
  ];

  return (
    <div className="why-flagged">
      <h3>Why We Flagged This</h3>
      <div className="indicators-list">
        {indicators.map((indicator, index) => (
          <div key={index} className="indicator-item">
            <div className="indicator-number">{index + 1}</div>
            <div className="indicator-content">
              <strong>{indicator.title}</strong>
              <span>{indicator.description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
