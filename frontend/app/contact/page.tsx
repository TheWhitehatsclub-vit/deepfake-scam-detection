'use client';
import { useEffect, useState } from 'react';

const CONTACT_WAYS = [
  { icon: '📧', label: 'Email Us', value: 'contact@trustshieldai.com', color: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)' },
  { icon: '🛠️', label: 'Support', value: 'support@trustshieldai.com', color: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.3)' },
  { icon: '🤝', label: 'Partnerships', value: 'partners@trustshieldai.com', color: 'rgba(124,58,237,0.15)', border: 'rgba(124,58,237,0.3)' },
  { icon: 'ℹ️', label: 'General Inquiries', value: 'info@trustshieldai.com', color: 'rgba(6,182,212,0.12)', border: 'rgba(6,182,212,0.3)' },
];

const FAQS = [
  { q: 'What types of threats can TrustShield AI detect?', a: 'TrustShield AI can detect deepfake images and videos, phishing websites, email scam attempts, and suspicious content in screenshots of messages or chats.' },
  { q: 'How accurate is the detection?', a: 'Our AI models achieve 95%+ accuracy on real-world data, and we continuously improve our models with new threat intelligence.' },
  { q: 'Is my data safe with TrustShield AI?', a: 'Absolutely. We follow a strict Privacy First policy — your data is never stored longer than needed for analysis and is never shared with third parties.' },
];

const SUBJECTS = ['General Inquiry', 'Technical Support', 'Partnership', 'Report a Bug', 'Other'];

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1500));
    setSending(false);
    setSent(true);
  };

  return (
    <>
      {/* Hero */}
      <section className="contact-hero">
        <div className="orb orb-cyan" style={{ width: 500, height: 500, top: -100, right: -100 }} />
        <div className="orb orb-purple" style={{ width: 300, height: 300, bottom: 0, left: -80 }} />
        <div className="container">
          <div className="contact-hero-inner">
            <div className="reveal">
              <span className="section-label">Get In Touch</span>
              <h1>Contact <span className="gradient-text">Us</span></h1>
              <p>We'd love to hear from you! Reach out for inquiries, collaborations, or support.</p>
            </div>
            <div className="contact-hero-icon reveal reveal-delay-2">
              <div className="envelope-icon">✉️</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section">
        <div className="container">
          <div className="contact-grid">
            {/* Form */}
            <div className="contact-form-wrap reveal">
              <div className="card form-card">
                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Get In Touch</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>
                  Have questions, feedback, or partnership ideas? Fill out the form and our team will get back to you as soon as possible.
                </p>
                {sent ? (
                  <div className="success-msg">
                    <div className="success-icon">✅</div>
                    <h3>Message Sent!</h3>
                    <p>Thank you for reaching out. We'll get back to you soon.</p>
                    <button className="btn-outline" style={{ marginTop: 16 }} onClick={() => { setSent(false); setFormState({ name: '', email: '', subject: '', message: '' }); }}>
                      Send Another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div className="form-group">
                      <label className="form-label">Your Name</label>
                      <input
                        className="form-input"
                        placeholder="Enter your name"
                        value={formState.name}
                        onChange={e => setFormState(s => ({ ...s, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-input"
                        placeholder="Enter your email"
                        value={formState.email}
                        onChange={e => setFormState(s => ({ ...s, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Subject</label>
                      <div style={{ position: 'relative' }}>
                        <select
                          className="form-select"
                          value={formState.subject}
                          onChange={e => setFormState(s => ({ ...s, subject: e.target.value }))}
                          required
                        >
                          <option value="" disabled>Select a subject</option>
                          {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                        </select>
                        <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}>▾</div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Your Message</label>
                      <textarea
                        className="form-textarea"
                        placeholder="Type your message here..."
                        value={formState.message}
                        onChange={e => setFormState(s => ({ ...s, message: e.target.value }))}
                        required
                      />
                    </div>
                    <button type="submit" className="btn-primary" disabled={sending} style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 15 }}>
                      <span>{sending ? '⏳ Sending...' : 'Send Message →'}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="contact-sidebar">
              <div className="reveal">
                <h3 className="sidebar-title">Other Ways to Reach Us</h3>
                <div className="contact-ways">
                  {CONTACT_WAYS.map(way => (
                    <div key={way.label} className="contact-way-item">
                      <div className="contact-way-icon" style={{ background: way.color, border: `1px solid ${way.border}` }}>
                        {way.icon}
                      </div>
                      <div>
                        <div className="contact-way-label">{way.label}</div>
                        <div className="contact-way-value">{way.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="reveal reveal-delay-2">
                <h3 className="sidebar-title">Follow Us</h3>
                <div style={{ display: 'flex', gap: 10 }}>
                  {['💼', '🐙', '🐦', '📸'].map((icon, i) => (
                    <a key={i} href="#" className="social-icon" style={{ fontSize: 18 }}>{icon}</a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" id="faq" style={{ background: 'var(--bg-secondary)', paddingTop: 60 }}>
        <div className="container">
          <div className="faq-layout">
            <div className="section-header reveal" style={{ textAlign: 'left', marginBottom: 0 }}>
              <span className="section-label">FAQ</span>
              <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', textAlign: 'left', marginBottom: 0 }}>Frequently Asked <span className="gradient-text">Questions</span></h2>
              <div className="glow-line" style={{ margin: '12px 0 0' }} />
            </div>
            <div className="faq-list reveal reveal-delay-1">
              {FAQS.map((faq, i) => (
                <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <div className="faq-question">
                    <span>{faq.q}</span>
                    <svg className="faq-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </div>
                  <div className="faq-answer">{faq.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Help Banner */}
      <section className="section">
        <div className="container">
          <div className="help-banner card reveal">
            <div className="help-icon">🤖</div>
            <div className="help-text">
              <h3>Need immediate help?</h3>
              <p>Our support team is available 24/7 to assist you.</p>
            </div>
            <a href="#" className="btn-primary"><span>Visit Help Center →</span></a>
          </div>
        </div>
      </section>

      <style jsx>{`
        .contact-hero {
          padding: 140px 0 60px;
          position: relative;
          overflow: hidden;
        }
        .contact-hero-inner { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 40px; }
        .contact-hero-inner h1 { font-size: clamp(36px, 5vw, 64px); font-weight: 800; margin: 12px 0 16px; }
        .contact-hero-inner p { font-size: 16px; color: var(--text-secondary); max-width: 440px; }
        .envelope-icon { font-size: 100px; animation: float-env 5s ease-in-out infinite; filter: drop-shadow(0 0 30px rgba(6,182,212,0.4)); }
        @keyframes float-env { 0%,100%{transform:translateY(0) rotate(-5deg)} 50%{transform:translateY(-15px) rotate(5deg)} }

        .contact-grid { display: grid; grid-template-columns: 1fr 340px; gap: 40px; align-items: start; }
        .form-card { padding: 36px; }

        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-primary);
          margin-bottom: 0;
        }
        .form-input {
          width: 100%;
          height: 48px;
          padding: 0 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text-primary);
          font-size: 14px;
          font-family: var(--font-body);
          outline: none;
          transition: var(--transition);
        }
        .form-input::placeholder {
          color: var(--text-muted);
        }
        .form-input:focus {
          border-color: var(--border-hover);
          background: rgba(255, 255, 255, 0.05);
        }
        .form-select {
          width: 100%;
          height: 48px;
          padding: 0 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text-primary);
          font-size: 14px;
          font-family: var(--font-body);
          outline: none;
          transition: var(--transition);
          appearance: none;
          cursor: pointer;
        }
        .form-select:focus {
          border-color: var(--border-hover);
          background: rgba(255, 255, 255, 0.05);
        }
        .form-textarea {
          width: 100%;
          min-height: 140px;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text-primary);
          font-size: 14px;
          font-family: var(--font-body);
          outline: none;
          transition: var(--transition);
          resize: none;
          line-height: 1.6;
        }
        .form-textarea::placeholder {
          color: var(--text-muted);
        }
        .form-textarea:focus {
          border-color: var(--border-hover);
          background: rgba(255, 255, 255, 0.05);
        }

        .success-msg { text-align: center; padding: 32px 0; display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .success-icon { font-size: 56px; }
        .success-msg h3 { font-size: 22px; font-weight: 700; }
        .success-msg p { color: var(--text-secondary); font-size: 14px; }

        .contact-sidebar { display: flex; flex-direction: column; gap: 32px; padding-top: 8px; }
        .sidebar-title { font-size: 16px; font-weight: 700; margin-bottom: 16px; color: white; }
        .contact-ways { display: flex; flex-direction: column; gap: 12px; }
        .contact-way-item { display: flex; align-items: center; gap: 14px; padding: 14px; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 10px; transition: var(--transition); }
        .contact-way-item:hover { border-color: var(--border-hover); background: rgba(124,58,237,0.05); }
        .contact-way-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
        .contact-way-label { font-size: 13px; font-weight: 600; margin-bottom: 2px; }
        .contact-way-value { font-size: 12px; color: var(--text-muted); }

        .faq-layout { display: grid; grid-template-columns: 300px 1fr; gap: 60px; align-items: start; }

        .help-banner { padding: 28px 36px; display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
        .help-icon { font-size: 52px; flex-shrink: 0; }
        .help-text { flex: 1; }
        .help-text h3 { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
        .help-text p { color: var(--text-secondary); font-size: 14px; }

        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr; }
          .faq-layout { grid-template-columns: 1fr; }
          .contact-hero-inner { grid-template-columns: 1fr; }
          .envelope-icon { display: none; }
        }
      `}</style>
    </>
  );
}
