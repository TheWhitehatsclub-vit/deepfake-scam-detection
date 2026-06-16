'use client';
import { useEffect } from 'react';
import Link from 'next/link';

const STEPS = [
  {
    num: 1,
    color: '#7c3aed',
    icon: '⬆️',
    title: 'Upload / Input',
    desc: 'Upload an image, video, screenshot, website URL, or email for analysis.',
  },
  {
    num: 2,
    color: '#3b82f6',
    icon: '🤖',
    title: 'AI Analysis',
    desc: 'Our advanced AI models analyze the content in real-time using deep learning and threat intelligence.',
  },
  {
    num: 3,
    color: '#06b6d4',
    icon: '🔍',
    title: 'Threat Detection',
    desc: 'The system detects deepfakes, scams, phishing attempts, or suspicious patterns with high accuracy.',
  },
  {
    num: 4,
    color: '#f97316',
    icon: '📋',
    title: 'Results & Report',
    desc: 'You receive a detailed report with risk score, highlights, and recommended actions.',
  },
  {
    num: 5,
    color: '#22c55e',
    icon: '🛡️',
    title: 'Stay Protected',
    desc: 'Make informed decisions and stay safe with TrustShield AI by your side.',
  },
];

export default function HowItWorksPage() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="page-hero">
        <div className="orb orb-purple" style={{ width: 500, height: 500, top: -100, right: -100 }} />
        <div className="orb orb-blue" style={{ width: 300, height: 300, bottom: 0, left: -100 }} />
        <div className="container">
          <div className="page-hero-inner reveal">
            <span className="section-label">Process</span>
            <h1>How <span className="gradient-text">TrustShield AI</span> Works</h1>
            <p>Our AI-powered system analyzes, detects and protects you from digital threats in just a few simple steps.</p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="section">
        <div className="container">
          <div className="steps-layout">
            <div className="steps-list">
              {STEPS.map((step, i) => (
                <div key={step.num} className={`step-item reveal reveal-delay-${(i % 4) + 1}`}>
                  <div className="step-left">
                    <div className="step-number" style={{ background: step.color, boxShadow: `0 0 20px ${step.color}50` }}>
                      {step.num}
                    </div>
                    {i < STEPS.length - 1 && <div className="step-connector" style={{ background: `linear-gradient(to bottom, ${step.color}, ${STEPS[i+1].color})` }} />}
                  </div>
                  <div className="step-card card">
                    <div className="step-icon-box" style={{ background: `${step.color}20`, border: `1px solid ${step.color}40` }}>
                      {step.icon}
                    </div>
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{step.title}</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7 }}>{step.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right CTA panel */}
            <div className="steps-cta-panel reveal reveal-delay-2">
              <div className="cta-panel-inner">
                <div className="cta-shield">
                  <svg width="80" height="90" viewBox="0 0 24 24" fill="none">
                    <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z" fill="url(#sh2)"/>
                    <path d="M8 11.5L10.5 14L16 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <defs>
                      <linearGradient id="sh2" x1="3" y1="1" x2="21" y2="23" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#7c3aed"/><stop offset="1" stopColor="#06b6d4"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <h3>AI That Protects. Anytime, Anywhere.</h3>
                <p>From deepfakes to phishing, TrustShield AI is your smartest defense against digital threats.</p>
                <Link href="/#features" className="btn-primary"><span>Explore Features →</span></Link>
              </div>
              <div className="accuracy-badge">
                <div className="accuracy-num">95%+</div>
                <div className="accuracy-label">Detection Accuracy</div>
                <div className="accuracy-sub">With continuous improvement</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .page-hero {
          padding: 160px 0 80px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .page-hero-inner h1 { font-size: clamp(32px, 5vw, 56px); font-weight: 800; margin: 12px 0 20px; }
        .page-hero-inner p { font-size: 17px; color: var(--text-secondary); max-width: 540px; margin: 0 auto; }

        .steps-layout {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 60px;
          align-items: start;
        }
        .steps-list { display: flex; flex-direction: column; }
        .step-item { display: flex; gap: 20px; }
        .step-left { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
        .step-number {
          width: 44px; height: 44px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 16px; color: white;
          flex-shrink: 0; z-index: 1;
          transition: transform 0.3s;
        }
        .step-item:hover .step-number { transform: scale(1.1); }
        .step-connector { width: 2px; flex: 1; min-height: 24px; opacity: 0.5; margin: 4px 0; }
        .step-card {
          flex: 1;
          padding: 24px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 16px;
        }
        .step-icon-box { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }

        /* CTA Panel */
        .steps-cta-panel { position: sticky; top: 100px; display: flex; flex-direction: column; gap: 20px; }
        .cta-panel-inner {
          background: var(--gradient-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          padding: 36px 28px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .cta-shield { filter: drop-shadow(0 0 30px rgba(124,58,237,0.5)); animation: shield-float 6s ease-in-out infinite; }
        @keyframes shield-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        .cta-panel-inner h3 { font-size: 20px; font-weight: 700; }
        .cta-panel-inner p { font-size: 14px; color: var(--text-secondary); line-height: 1.7; }
        .accuracy-badge {
          background: var(--gradient-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 24px;
          text-align: center;
        }
        .accuracy-num { font-size: 42px; font-weight: 800; background: var(--gradient-text); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .accuracy-label { font-size: 14px; font-weight: 600; margin: 4px 0; }
        .accuracy-sub { font-size: 12px; color: var(--text-muted); }

        @media (max-width: 1024px) {
          .steps-layout { grid-template-columns: 1fr; }
          .steps-cta-panel { position: static; flex-direction: row; }
          .cta-panel-inner, .accuracy-badge { flex: 1; }
        }
        @media (max-width: 640px) {
          .steps-cta-panel { flex-direction: column; }
        }
      `}</style>
    </>
  );
}
