import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'TrustShield AI – AI Powered Digital Safety',
  description: 'Detect deepfakes, scams, phishing attempts, and suspicious content with advanced AI.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <footer className="site-footer">
          <div className="container">
            <div className="footer-inner">
              <div className="footer-brand">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 32, height: 32, background: 'rgba(124,58,237,0.15)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(124,58,237,0.3)' }}>🛡️</div>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>TrustShield AI</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.7 }}>Building a safer digital world with the power of artificial intelligence.</p>
              </div>
              <div className="footer-links">
                <h4>Product</h4>
                <ul>
                  <li><a href="/#features">Features</a></li>
                  <li><a href="/how-it-works">How It Works</a></li>
                  <li><a href="/about">About Us</a></li>
                </ul>
              </div>
              <div className="footer-links">
                <h4>Support</h4>
                <ul>
                  <li><a href="/contact">Contact</a></li>
                  <li><a href="/contact#faq">FAQ</a></li>
                  <li><a href="#">Help Center</a></li>
                </ul>
              </div>
            </div>
            <div className="footer-bottom">
              <p>© {new Date().getFullYear()} TrustShield AI. All rights reserved.</p>
              <p>MIT License</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
