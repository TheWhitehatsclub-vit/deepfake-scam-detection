'use client';
import { useEffect } from 'react';
import Link from 'next/link';

const STATS = [
  { label: 'AI-Powered', sub: 'Advanced machine learning models', icon: '🧠' },
  { label: 'Real-Time', sub: 'Instant analysis and threat detection', icon: '⚡' },
  { label: '95%+', sub: 'Accurate detection with continuous improvement', icon: '🎯', highlight: true },
  { label: 'Privacy First', sub: 'Your data is safe and secure', icon: '🔒' },
];

const TEAM = [
  { name: 'Name Here', role: 'Role / Position', emoji: '👨‍💻' },
  { name: 'Name Here', role: 'Role / Position', emoji: '👩‍💻' },
  { name: 'Name Here', role: 'Role / Position', emoji: '👨‍🔬' },
  { name: 'Name Here', role: 'Role / Position', emoji: '👩‍🔬' },
];

export default function AboutPage() {
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
      <section className="page-hero about-hero">
        <div className="orb orb-blue" style={{ width: 600, height: 600, top: -200, right: -100, animationDelay: '0s' }} />
        <div className="orb orb-purple" style={{ width: 400, height: 400, bottom: -100, left: -100, animationDelay: '3s' }} />
        <div className="container">
          <div className="about-hero-inner">
            <div className="reveal">
              <span className="section-label">Who We Are</span>
              <h1>About <span className="gradient-text">TrustShield AI</span></h1>
              <p>Building a safer digital world with the power of artificial intelligence.</p>
            </div>
            <div className="hero-shield reveal reveal-delay-2">
              <div className="shield-glow">
                <svg width="140" height="160" viewBox="0 0 24 24" fill="none">
                  <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z" fill="url(#sha)"/>
                  <path d="M8 11.5L10.5 14L16 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <defs>
                    <linearGradient id="sha" x1="3" y1="1" x2="21" y2="23" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#7c3aed"/><stop offset="0.5" stopColor="#3b82f6"/><stop offset="1" stopColor="#06b6d4"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header reveal">
            <h2>Who <span className="gradient-text">We Are</span></h2>
            <div className="glow-line" />
          </div>
          <p className="about-intro reveal reveal-delay-1">
            TrustShield AI is a next-generation cybersecurity platform developed by a passionate team of innovators, developers, and AI enthusiasts. Our mission is to empower individuals and organizations to navigate the digital world safely and confidently.
          </p>

          {/* Stat row */}
          <div className="stat-row">
            {STATS.map((s, i) => (
              <div key={s.label} className={`about-stat card reveal reveal-delay-${i + 1} ${s.highlight ? 'stat-highlight' : ''}`}>
                <div className="about-stat-icon">{s.icon}</div>
                <div className="about-stat-label">{s.label}</div>
                <div className="about-stat-sub">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">The People</span>
            <h2>Meet Our <span className="gradient-text">Team</span></h2>
            <div className="glow-line" />
          </div>
          <div className="team-grid">
            {TEAM.map((member, i) => (
              <div key={i} className={`team-card card reveal reveal-delay-${i + 1}`}>
                <div className="team-avatar">{member.emoji}</div>
                <h3 className="team-name">{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <div className="team-socials">
                  {['in', '⚙', '🔗'].map((icon, j) => (
                    <div key={j} className="social-icon" style={{ fontSize: 14 }}>{icon}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="mv-grid">
            <div className="mv-card card reveal">
              <div className="mv-icon">🎯</div>
              <h3>Our Mission</h3>
              <p>To create intelligent tools that detect digital threats before they cause harm and make the internet a safer place for everyone.</p>
            </div>
            <div className="mv-card card reveal reveal-delay-2">
              <div className="mv-icon">👁️</div>
              <h3>Our Vision</h3>
              <p>A world where technology and trust go hand-in-hand, and people can interact online without fear of deception or fraud.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section">
        <div className="container">
          <div className="bottom-cta card reveal">
            <div className="bottom-cta-icon">🔒</div>
            <h2>Innovation. Security. Trust.</h2>
            <p>These are the pillars that drive everything we do at TrustShield AI. Together, let's build a safer digital future.</p>
            <Link href="/contact" className="btn-primary" style={{ marginTop: 8 }}><span>Get In Touch →</span></Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .page-hero {
          padding: 140px 0 80px;
          position: relative;
          overflow: hidden;
        }
        .about-hero-inner {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 48px;
        }
        .about-hero-inner h1 { font-size: clamp(36px, 5vw, 60px); font-weight: 800; margin: 12px 0 16px; }
        .about-hero-inner p { font-size: 17px; color: var(--text-secondary); max-width: 480px; }
        .hero-shield { display: flex; justify-content: center; }
        .shield-glow { filter: drop-shadow(0 0 50px rgba(124,58,237,0.6)); animation: float-shield 6s ease-in-out infinite; }
        @keyframes float-shield { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-15px)} }

        .about-intro { font-size: 16px; color: var(--text-secondary); line-height: 1.8; max-width: 800px; margin: 0 auto 48px; text-align: center; }
        .stat-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .about-stat { padding: 28px 20px; text-align: center; }
        .stat-highlight { border-color: rgba(124,58,237,0.4); background: rgba(124,58,237,0.08); }
        .about-stat-icon { font-size: 30px; margin-bottom: 10px; }
        .about-stat-label { font-size: 18px; font-weight: 700; margin-bottom: 6px; background: var(--gradient-text); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .about-stat-sub { font-size: 12px; color: var(--text-muted); line-height: 1.5; }

        .team-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .team-card { padding: 32px 24px; text-align: center; }
        .team-avatar { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, rgba(124,58,237,0.2), rgba(59,130,246,0.2)); border: 2px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 36px; margin: 0 auto 16px; }
        .team-name { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
        .team-role { font-size: 13px; color: var(--text-muted); margin-bottom: 16px; }
        .team-socials { display: flex; gap: 8px; justify-content: center; }

        .mv-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .mv-card { padding: 36px; }
        .mv-icon { font-size: 36px; margin-bottom: 16px; }
        .mv-card h3 { font-size: 22px; font-weight: 700; margin-bottom: 12px; }
        .mv-card p { color: var(--text-secondary); font-size: 15px; line-height: 1.8; }

        .bottom-cta { padding: 56px 48px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 16px; }
        .bottom-cta-icon { font-size: 52px; filter: drop-shadow(0 0 20px rgba(124,58,237,0.5)); }
        .bottom-cta h2 { font-size: 32px; font-weight: 800; }
        .bottom-cta p { color: var(--text-secondary); max-width: 480px; }

        @media (max-width: 1024px) {
          .stat-row { grid-template-columns: repeat(2, 1fr); }
          .team-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .about-hero-inner { grid-template-columns: 1fr; }
          .hero-shield { display: none; }
          .mv-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .stat-row { grid-template-columns: 1fr; }
          .team-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
