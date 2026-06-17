'use client';

export default function AIExplanationCard() {
  const handleViewReport = () => {
    console.log('View full report action');
  };

  return (
    <div className="ai-explanation-card">
      <h3>AI Explanation</h3>
      <p>The message follows common scam patterns: it claims a large reward, creates urgency with a short time limit, and uses a suspicious external link.</p>
      <p>These tactics are often used to steal personal data or trick users into fraudulent websites.</p>
      <button className="btn-outline" onClick={handleViewReport}>
        View Full Report
      </button>
    </div>
  );
}
