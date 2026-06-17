'use client';

import Link from 'next/link';
import RiskSummaryCard from '@/components/screenshot-analysis/results/RiskSummaryCard';
import DetectedTactics from '@/components/screenshot-analysis/results/DetectedTactics';
import ScreenshotPreview from '@/components/screenshot-analysis/results/ScreenshotPreview';
import WhyFlagged from '@/components/screenshot-analysis/results/WhyFlagged';
import ScreenshotDetails from '@/components/screenshot-analysis/results/ScreenshotDetails';
import RecommendationCard from '@/components/screenshot-analysis/results/RecommendationCard';
import AIExplanationCard from '@/components/screenshot-analysis/results/AIExplanationCard';
import './results.css';

export default function ScreenshotResultsPage() {
  return (
    <>
      <div className="crumb-bar">
        <div className="container">
          <div className="crumb">
            <Link href="/screenshot-analysis" className="back-link">
              <i className="ti ti-arrow-left" /> Back to Analyzer
            </Link>
          </div>
        </div>
      </div>

      {/* HEADER */}
      <section className="results-header">
        <div className="container header-inner">
          <div className="header-left">
            <h1 className="h-title">Screenshot Analysis Result</h1>
            <p className="header-sub">Here's what we found in your screenshot.</p>
          </div>
          <div className="header-right">
            <Link href="/screenshot-analysis" className="btn-primary">
              Analyze Another
            </Link>
          </div>
        </div>
      </section>

      {/* RISK SUMMARY CARD */}
      <section className="risk-section">
        <div className="container">
          <RiskSummaryCard />
        </div>
      </section>

      {/* DETECTED TACTICS */}
      <section className="tactics-section">
        <div className="container">
          <DetectedTactics />
        </div>
      </section>

      {/* TWO COLUMN LAYOUT */}
      <section className="two-column-section">
        <div className="container">
          <div className="two-column-grid">
            <div className="column-left">
              <ScreenshotPreview />
            </div>
            <div className="column-right">
              <WhyFlagged />
              <ScreenshotDetails />
            </div>
          </div>
        </div>
      </section>

      {/* RECOMMENDATION AND AI EXPLANATION */}
      <section className="final-section">
        <div className="container">
          <div className="final-grid">
            <RecommendationCard />
            <AIExplanationCard />
          </div>
        </div>
      </section>
    </>
  );
}
