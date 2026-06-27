import type { Metadata } from 'next';
import Link from 'next/link';
import './features.css';

export const metadata: Metadata = {
  title: 'Features – TrustShield AI',
  description: 'Explore all four AI-powered detection modules offered by TrustShield AI.',
};

const MODULES = [
  {
    icon: '🎬',
    color: 'rgba(124,58,237,0.15)',
    border: 'rgba(124,58,237,0.3)',
    title: 'Deepfake Image / Video Detection',
    desc: 'Detect AI-generated or manipulated images and videos with high accuracy. Get a full breakdown including authenticity score, Grad-CAM heatmaps, and an explainable AI report.',
    tags: ['Authenticity score', 'Grad-CAM heatmap', 'Face analysis'],
    cta: 'Detect Now',
    ctaColor: 'var(--purple-light)',
    href: '/features/deepfake-detection',
    available: true,
  },
  {
    icon: '🌐',
    color: 'rgba(6,182,212,0.12)',
    border: 'rgba(6,182,212,0.25)',
    title: 'Scam Website Detection',
    desc: 'Identify suspicious websites, phishing pages, and online threats before they harm you. Checks domain age, SSL certificates, and live threat feeds.',
    tags: ['WHOIS lookup', 'SSL check', 'Threat feeds'],
    cta: 'Detect Now',
    ctaColor: 'var(--cyan-accent)',
    href: '/features/scam-website-detection',
    available: false,
  },
  {
    icon: '📧',
    color: 'rgba(249,115,22,0.12)',
    border: 'rgba(249,115,22,0.25)',
    title: 'Email Phishing Detection',
    desc: 'Analyze emails and detect phishing attempts, malicious links, and scam tricks by inspecting sender headers and urgency language patterns.',
    tags: ['Header analysis', 'Link inspection', 'Tone detection'],
    cta: 'Detect Now',
    ctaColor: 'var(--orange-accent)',
    href: '/features/email-phishing-detection',
    available: false,
  },
  {
    icon: '📱',
    color: 'rgba(59,130,246,0.12)',
    border: 'rgba(59,130,246,0.25)',
    title: 'Screenshot Analysis',
    desc: 'Upload screenshots of messages or chats to detect scams and suspicious content using OCR text extraction and pattern matching.',
    tags: ['OCR extraction', 'Context scoring', 'Pattern match'],
    cta: 'Detect Now',
    ctaColor: 'var(--blue-accent)',
    href: '/features/screenshot-analysis',
    available: false,
  },
];

export default function FeaturesPage() {
  return (
    <>
      <section className="features-hero">
        <div className="orb orb-purple" style={{ width: 460, height: 460, top: '-10%', right: '-8%' }} />
        <div className="container">
          <div className="crumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span className="current">Features</span>
          </div>
          <span className="section-label">All Detection Modules</span>
          <h1 className="features-title">
            Four ways manipulation reaches you. <span className="gradient-text">One way to check it.</span>
          </h1>
          <p className="features-sub">
            Pick a module below to scan your content. Each one is built to catch the specific
            patterns that particular type of threat leaves behind.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 20 }}>
        <div className="container">
          <div className="modules-grid">
            {MODULES.map((mod) => (
              <div key={mod.title} className="card module-card">
                <div className="module-card-top">
                  <div className="module-icon" style={{ background: mod.color, border: `1px solid ${mod.border}` }}>
                    {mod.icon}
                  </div>
                  {!mod.available && <span className="soon-badge">Coming soon</span>}
                </div>
                <h3 className="module-title">{mod.title}</h3>
                <p className="module-desc">{mod.desc}</p>
                <div className="module-tags">
                  {mod.tags.map((tag) => (
                    <span key={tag} className="module-tag">{tag}</span>
                  ))}
                </div>
                {mod.available ? (
                  <Link href={mod.href} className="btn-primary module-btn">
                    {mod.cta} →
                  </Link>
                ) : (
                  <span className="btn-outline module-btn module-btn-disabled">
                    {mod.cta} →
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
