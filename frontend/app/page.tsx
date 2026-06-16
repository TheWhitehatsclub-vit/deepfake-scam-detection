'use client';
import { useEffect } from 'react';
import Link from 'next/link';

const MODULES = [
  {
    icon: '🎬',
    color: 'rgba(124,58,237,0.15)',
    border: 'rgba(124,58,237,0.3)',
    title: 'Deepfake Image / Video Detection',
    desc: 'Detect AI-generated or manipulated images and videos with high accuracy.',
    cta: 'Detect Now',
    ctaColor: 'var(--purple-light)',
  },
  {
    icon: '🌐',
    color: 'rgba(6,182,212,0.12)',
    border: 'rgba(6,182,212,0.25)',
    title: 'Scam Website Detection',
    desc: 'Identify suspicious websites, phishing pages, and online threats before they harm you.',
    cta: 'Detect Now',
    ctaColor: 'var(--cyan-accent)',
  },
  {
    icon: '📧',
    color: 'rgba(249,115,22,0.12)',
    border: 'rgba(249,115,22,0.25)',
    title: 'Email Phishing Detection',
    desc: 'Analyze emails and detect phishing attempts, malicious links, and scam tricks.',
    cta: 'Detect Now',
    ctaColor: 'var(--orange-accent)',
  },
  {
    icon: '📱',
    color: 'rgba(59,130,246,0.12)',
    border: 'rgba(59,130,246,0.25)',
    title: 'Screenshot Analysis',
    desc: 'Upload screenshots of messages or chats to detect scams and suspicious content.',
    cta: 'Detect Now',
    ctaColor: 'var(--blue-accent)',
  },
];

const STATS = [
  { icon: '🧠', label: 'Advanced AI Models', sub: 'Trained on millions of real-world data' },
  { icon: '🔒', label: 'Secure & Private', sub: 'Your data is protected and never misused' },
  { icon: '✅', label: 'Accurate & Reliable', sub: 'High accuracy with continuous improvement' },
  { icon: '⚡', label: 'Fast & Real-Time', sub: 'Get results in seconds, instantly' },
];

export default function Home() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
      </section>

      {/* ── Core Protection Modules ── */}
      <section className="section" id="features" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">Protection Modules</span>
            <h2>Our <span className="gradient-text">Core Protection</span> Modules</h2>
            <div className="glow-line" />
            <p style={{ marginTop: 16 }}>Comprehensive AI tools to protect you from the most common digital threats.</p>
          </div>
          <div className="grid-4">
            {MODULES.map((mod, i) => (
              <div key={mod.title} className={`card module-card reveal reveal-delay-${i + 1}`}>
                <div className="module-icon" style={{ background: mod.color, border: `1px solid ${mod.border}` }}>
                  {mod.icon}
                </div>
                <h3 className="module-title">{mod.title}</h3>
                <p className="module-desc">{mod.desc}</p>
                <a href="#" className="module-cta" style={{ color: mod.ctaColor }}>
                  {mod.cta} →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About Strip ── */}
      <section className="section" style={{ paddingBottom: 80 }}>
        <div className="orb orb-purple" style={{ width: 500, height: 500, top: 0, left: -200, animationDelay: '2s' }} />
        <div className="container">
          <div className="about-strip">
            <div className="about-strip-text reveal">
              <span className="section-label">About TrustShield AI</span>
              <h2 style={{ fontSize: 'clamp(24px,3.5vw,38px)', margin: '12px 0 16px' }}>
                Building a <span className="gradient-text">Safer Digital World</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.8, marginBottom: 28 }}>
                TrustShield AI is an all-in-one cybersecurity platform powered by advanced artificial intelligence. Our mission is to create a safer digital world by detecting and preventing online threats in real-time.
              </p>
              <Link href="/about" className="btn-outline">Learn More About Us →</Link>
            </div>
            <div className="stats-grid reveal reveal-delay-1">
              {STATS.map((s) => (
                <div key={s.label} className="stat-card">
                  <div className="stat-icon">{s.icon}</div>
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-sub">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        /* Hero */
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
          padding-top: 80px;
        }
        .hero-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 64px;
          padding: 60px 0;
        }
        .hero-title {
          font-size: clamp(36px, 5vw, 64px);
          font-weight: 800;
          line-height: 1.1;
          margin: 16px 0 20px;
          letter-spacing: -0.02em;
        }
        .hero-desc {
          font-size: 17px;
          color: var(--text-secondary);
          line-height: 1.75;
          max-width: 480px;
          margin-bottom: 32px;
        }
        .hero-pills {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 36px;
        }
        .hero-pill {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .pill-icon { font-size: 20px; }
        .pill-label { font-size: 13px; font-weight: 600; color: white; }
        .pill-sub { font-size: 11px; color: var(--text-muted); }
        .hero-ctas { display: flex; gap: 14px; flex-wrap: wrap; }

        /* Shield Visual */
        .hero-visual { display: flex; justify-content: center; align-items: center; }
        .shield-container {
          position: relative;
          width: 380px;
          height: 380px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .shield-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(124,58,237,0.2);
          animation: ring-pulse 4s ease-in-out infinite;
        }
        .ring-1 { width: 260px; height: 260px; animation-delay: 0s; }
        .ring-2 { width: 320px; height: 320px; animation-delay: 0.8s; border-color: rgba(59,130,246,0.15); }
        .ring-3 { width: 380px; height: 380px; animation-delay: 1.6s; border-color: rgba(6,182,212,0.1); }
        @keyframes ring-pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); }
        }
        .shield-core {
          position: relative;
          z-index: 2;
          animation: shield-float 6s ease-in-out infinite;
          filter: drop-shadow(0 0 40px rgba(124,58,237,0.5));
        }
        @keyframes shield-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-16px); }
        }

        /* Float badges */
        .float-badge {
          position: absolute;
          background: rgba(13, 20, 40, 0.9);
          border: 1px solid var(--border);
          border-radius: 50px;
          padding: 8px 16px;
          font-size: 12px;
          font-weight: 600;
          color: white;
          backdrop-filter: blur(10px);
          white-space: nowrap;
          z-index: 3;
        }
        .float-1 { top: 30px; left: 10px; animation: float-a 5s ease-in-out infinite; border-color: rgba(124,58,237,0.4); }
        .float-2 { top: 30px; right: 10px; animation: float-b 5s ease-in-out infinite 1s; border-color: rgba(6,182,212,0.4); }
        .float-3 { bottom: 60px; left: 5px; animation: float-a 5s ease-in-out infinite 2s; border-color: rgba(249,115,22,0.4); }
        .float-4 { bottom: 60px; right: 0px; animation: float-b 5s ease-in-out infinite 3s; border-color: rgba(34,197,94,0.4); color: #4ade80; }
        @keyframes float-a { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-8px) rotate(2deg)} }
        @keyframes float-b { 0%,100%{transform:translateY(0) rotate(2deg)} 50%{transform:translateY(-10px) rotate(-2deg)} }

        /* Modules */
        .module-card { padding: 32px 28px; display: flex; flex-direction: column; gap: 16px; }
        .module-icon { width: 72px; height: 72px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 32px; }
        .module-title { font-size: 18px; font-weight: 700; line-height: 1.3; }
        .module-desc { font-size: 14px; color: var(--text-secondary); line-height: 1.7; flex: 1; }
        .module-cta { font-size: 14px; font-weight: 600; text-decoration: none; transition: all 0.2s; }
        .module-cta:hover { opacity: 0.8; letter-spacing: 0.02em; }

        /* About strip */
        .about-strip { display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 80px; }
        .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .stat-card {
          background: var(--gradient-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 24px 20px;
          text-align: center;
          transition: var(--transition);
        }
        .stat-card:hover { border-color: var(--border-hover); transform: translateY(-3px); }
        .stat-icon { font-size: 28px; margin-bottom: 10px; }
        .stat-label { font-size: 14px; font-weight: 600; margin-bottom: 6px; }
        .stat-sub { font-size: 12px; color: var(--text-muted); line-height: 1.5; }

        @media (max-width: 900px) {
          .hero-inner { grid-template-columns: 1fr; text-align: center; gap: 40px; }
          .hero-desc { margin: 0 auto 32px; }
          .hero-pills { justify-content: center; }
          .hero-ctas { justify-content: center; }
          .hero-visual { display: none; }
          .about-strip { grid-template-columns: 1fr; gap: 40px; }
        }
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </>
  );
}
