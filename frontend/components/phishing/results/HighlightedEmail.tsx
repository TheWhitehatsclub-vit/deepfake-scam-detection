'use client';

export default function HighlightedEmail() {
  const highlights = ['unusual activity', 'immediately', 'within 24 hours'];
  const suspiciousDomain = 'amaz0n-account-verify-secure.com';

  const highlightText = (text: string) => {
    let highlighted = text;
    highlights.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi');
      highlighted = highlighted.replace(regex, '<span class="highlight-yellow">$1</span>');
    });
    
    // Highlight suspicious URL in red
    const urlRegex = /(https:\/\/[^\s]+)/g;
    highlighted = highlighted.replace(urlRegex, (match) => {
      if (match.includes(suspiciousDomain)) {
        return `<span class="highlight-red">${match}</span>`;
      }
      return match;
    });
    
    return <span dangerouslySetInnerHTML={{ __html: highlighted }} />;
  };

  const indicators = [
    { text: 'Creates urgency', highlight: false },
    { text: 'Requests immediate action', highlight: false },
    { text: 'Suspicious domain: amaz0n-account-verify-secure.com', highlight: true },
    { text: 'Uses time pressure to scare you', highlight: false },
  ];

  return (
    <div className="highlighted-email-card">
      <div className="email-content-left">
        <div className="email-header">
          <div className="email-field">
            <span className="field-label">Subject:</span>
            <span className="field-value">Action Required: Verify Your Amazon Account</span>
          </div>
          <div className="email-field">
            <span className="field-label">From:</span>
            <span className="field-value field-value-suspicious">security@amazon-account-verify-secure.com</span>
          </div>
        </div>
        <div className="email-body">
          <p>Dear Customer,</p>
          <p>{highlightText('We detected unusual activity on your Amazon account.')}</p>
          <p>{highlightText('To prevent temporary suspension, please verify your account information immediately using the secure portal below:')}</p>
          <p className="email-link">{highlightText('https://amaz0n-account-verify-secure.com/login')}</p>
          <p>{highlightText('Failure to complete verification within 24 hours will result in restricted access to your account.')}</p>
          <p>Thank you,</p>
          <p>Amazon Security Team</p>
        </div>
      </div>
      <div className="email-content-right">
        <h4>Key Indicators</h4>
        <ul className="indicator-list">
          {indicators.map((indicator, index) => (
            <li key={index}>
              {indicator.highlight ? (
                <span className="indicator-highlight-red">{indicator.text}</span>
              ) : (
                indicator.text
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
