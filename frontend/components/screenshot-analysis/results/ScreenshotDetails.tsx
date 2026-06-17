'use client';

export default function ScreenshotDetails() {
  const details = [
    { label: 'Screenshot Type', value: 'WhatsApp Chat' },
    { label: 'URLs Found', value: '1 (suspicious)' },
    { label: 'Trust Score', value: '11/100' },
    { label: 'Analysis Time', value: '2.3 seconds' },
  ];

  return (
    <div className="screenshot-details">
      <h3>Screenshot Details</h3>
      <div className="details-grid">
        {details.map((detail, index) => (
          <div key={index} className="detail-item">
            <span className="detail-label">{detail.label}</span>
            <span className="detail-value">{detail.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
