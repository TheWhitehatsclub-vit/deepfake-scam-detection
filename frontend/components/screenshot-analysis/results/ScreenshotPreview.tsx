'use client';

export default function ScreenshotPreview() {
  const annotations = [
    { id: 'reward', label: 'Reward Trigger', description: 'Uses prize to attract attention' },
    { id: 'urgency', label: 'Urgency', description: 'Pressures you to act immediately' },
    { id: 'link', label: 'Suspicious Link', description: 'Untrusted domain detected' },
    { id: 'time', label: 'Time Pressure', description: 'Creates fear of missing out' },
  ];

  return (
    <div className="screenshot-preview">
      <h3>Screenshot Preview & Highlights</h3>
      <div className="preview-layout">
        <div className="preview-left">
          <div className="whatsapp-screenshot">
            <div className="whatsapp-header">
              <div className="whatsapp-avatar">👤</div>
              <div className="whatsapp-info">
                <strong>+91 98765 43210</strong>
                <span>online</span>
              </div>
            </div>
            <div className="whatsapp-message">
              <p>🎉 Congratulations!</p>
              <p>You have won <span className="highlight highlight-red" data-annotation="reward">₹50,000</span>!</p>
              <p>Claim your reward <span className="highlight highlight-red" data-annotation="urgency">immediately</span> at:</p>
              <p><span className="highlight highlight-red" data-annotation="link">https://claim-reward-secure.xyz</span></p>
              <p>Offer <span className="highlight highlight-orange" data-annotation="time">expires in 2 hours</span>.</p>
              <p>Hurry up and claim your reward now!</p>
            </div>
          </div>
        </div>
        <div className="preview-right">
          {annotations.map((annotation) => (
            <div key={annotation.id} className="annotation-card" data-annotation={annotation.id}>
              <strong>{annotation.label}</strong>
              <span>{annotation.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
