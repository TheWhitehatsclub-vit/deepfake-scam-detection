'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/features' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="nav-container">
          {/* Logo */}
          <Link href="/" className="nav-logo">
            <div className="nav-logo-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L4 6V12C4 15.77 7.58 19.5 12 21C16.42 19.5 20 15.77 20 12V6L12 2Z" fill="url(#shield-grad)"/>
                <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="shield-grad" x1="4" y1="2" x2="20" y2="21" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#7c3aed"/>
                    <stop offset="1" stopColor="#3b82f6"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div>
              <div className="nav-logo-name">TrustShield AI</div>
              <div className="nav-logo-sub">AI Powered Digital Safety</div>
            </div>
          </Link>

          {/* Desktop Links */}
          <ul className="nav-links">
            {NAV_LINKS.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`nav-link ${pathname === link.href ? 'nav-link-active' : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="nav-actions">
            <Link href="/history" className="btn-outline" style={{ padding: '8px 18px', fontSize: '13px' }}>
              <span>🕐</span> History
            </Link>
            <Link href="/login" className="btn-primary">
              <span>Login</span>
            </Link>
          </div>

          {/* Hamburger */}
          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span/><span/><span/>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <ul>
          {NAV_LINKS.map(link => (
            <li key={link.href}>
              <Link href={link.href} className="mobile-link" onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            </li>
          ))}
          <li style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link href="/history" className="btn-outline" style={{ justifyContent: 'center' }}>🕐 History</Link>
            <Link href="/login" className="btn-primary" style={{ justifyContent: 'center' }}><span>Login</span></Link>
          </li>
        </ul>
      </div>

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          padding: 16px 0;
          transition: all 0.3s ease;
        }
        .navbar-scrolled {
          background: rgba(5, 8, 21, 0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(99, 102, 241, 0.1);
          padding: 10px 0;
        }
        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          gap: 32px;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .nav-logo-icon {
          width: 36px; height: 36px;
          background: rgba(124,58,237,0.15);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid rgba(124,58,237,0.3);
        }
        .nav-logo-name { font-family: var(--font-display); font-size: 15px; font-weight: 700; color: white; line-height: 1; }
        .nav-logo-sub { font-size: 10px; color: var(--text-muted); }
        .nav-links {
          list-style: none;
          display: flex;
          align-items: center;
          gap: 4px;
          flex: 1;
          justify-content: center;
        }
        .nav-link {
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-secondary);
          text-decoration: none;
          transition: all 0.2s;
          position: relative;
        }
        .nav-link:hover { color: white; background: rgba(255,255,255,0.05); }
        .nav-link-active { color: white; }
        .nav-link-active::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 50%; transform: translateX(-50%);
          width: 20px; height: 2px;
          background: var(--gradient-text);
          border-radius: 1px;
        }
        .nav-actions { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        .hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; background: none; border: none; padding: 4px; }
        .hamburger span { display: block; width: 22px; height: 2px; background: var(--text-secondary); border-radius: 1px; transition: all 0.3s; }
        .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        .mobile-menu {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(5, 8, 21, 0.97);
          backdrop-filter: blur(20px);
          z-index: 999;
          padding: 100px 24px 40px;
          transform: translateX(100%);
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .mobile-menu.open { transform: translateX(0); }
        .mobile-menu ul { list-style: none; display: flex; flex-direction: column; gap: 6px; }
        .mobile-link {
          display: block;
          padding: 16px 20px;
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
          text-decoration: none;
          border-radius: 12px;
          transition: all 0.2s;
        }
        .mobile-link:hover { background: rgba(124,58,237,0.1); color: var(--purple-light); }

        @media (max-width: 900px) {
          .nav-links, .nav-actions { display: none; }
          .hamburger { display: flex; margin-left: auto; }
        }
      `}</style>
    </>
  );
}
