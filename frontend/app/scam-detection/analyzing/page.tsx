'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Circle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import './analyzing.css';

export default function ScamAnalyzingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');

  const steps = [
    'Extracting domain and URL data',
    'Checking SSL certificate',
    'Analyzing reputation and blacklist status',
    'Scanning content and structure',
    'Generating AI analysis',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1000);

    const runAnalysis = async () => {
      try {
        const url = localStorage.getItem('scam_url');
        if (!url) {
          router.push('/scam-detection');
          return;
        }

        const response = await fetch('http://127.0.0.1:8000/api/scam-website/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        });

        if (!response.ok) throw new Error('API request failed');

        const data = await response.json();
        localStorage.setItem('scam_result', JSON.stringify(data));

        // save to Supabase history — don't block navigation if this fails
        try {
          await supabase.from('scam_website_history').insert({
            url: data.url,
            domain: data.domain,
            trust_score: data.trust_score,
            overall_status: data.overall_status,
            checks: data.checks,
          });
        } catch (saveErr) {
          console.error('Failed to save history:', saveErr);
        }

        clearInterval(interval);
        router.push('/scam-detection/results');

      } catch (err) {
        setError('Analysis failed. Please try again.');
        clearInterval(interval);
      }
    };

    runAnalysis();
    return () => clearInterval(interval);
  }, [router]);

  if (error) {
    return (
      <div className="analyzing-page">
        <div className="container">
          <div className="analyzing-content">
            <p style={{ color: 'red' }}>{error}</p>
            <button onClick={() => router.push('/scam-detection')}>Go Back</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="analyzing-page">
      <div className="container">
        <div className="analyzing-content">
          <div className="globe-container">
            <div className="glow-ring glow-ring-1" />
            <div className="glow-ring glow-ring-2" />
            <div className="glow-ring glow-ring-3" />
            <div className="globe-icon">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" stroke="url(#globe-grad)" strokeWidth="1.5" fill="none"/>
                <path d="M2 12H22" stroke="url(#globe-grad)" strokeWidth="1.5" fill="none"/>
                <path d="M12 2C15.5 2 18.5 4 20 7" stroke="url(#globe-grad)" strokeWidth="1.5" fill="none"/>
                <path d="M12 22C8.5 22 5.5 20 4 17" stroke="url(#globe-grad)" strokeWidth="1.5" fill="none"/>
                <path d="M12 2V22" stroke="url(#globe-grad)" strokeWidth="1.5" fill="none"/>
                <defs>
                  <linearGradient id="globe-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#7c3aed"/>
                    <stop offset="1" stopColor="#3b82f6"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          <h1 className="analyzing-title">Analyzing Website</h1>
          <p className="analyzing-subtitle">Please wait while we scan and analyze the website...</p>

          <div className="checklist">
            {steps.map((step, index) => (
              <div key={index} className="checklist-item">
                {index <= currentStep ? (
                  <div className="check-icon completed"><Check size={16} /></div>
                ) : (
                  <div className="check-icon pending"><Circle size={16} /></div>
                )}
                <span className={index <= currentStep ? 'completed' : 'pending'}>{step}</span>
              </div>
            ))}
          </div>

          <div className="info-card">
            <div className="info-icon">⏳</div>
            <div className="info-text">
              <strong>This may take a few seconds...</strong>
              <span>Please don't close this window.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}