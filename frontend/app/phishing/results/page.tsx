'use client';

import Link from 'next/link';
import RiskSummaryCard from '@/components/phishing/results/RiskSummaryCard';
import FlagReasons from '@/components/phishing/results/FlagReasons';
import HighlightedEmail from '@/components/phishing/results/HighlightedEmail';
import RecommendationCard from '@/components/phishing/results/RecommendationCard';
import AIExplanationCard from '@/components/phishing/results/AIExplanationCard';
import './results.css';

export default function PhishingResultsPage() {
  return (
    <>
      <div className="crumb-bar">
        <div className="container">
          <div className="crumb">
            <Link href="/phishing" className="back-link">
              <i className="ti ti-arrow-left" /> Back to Analyzer
            </Link>
          </div>
        </div>
      </div>

      {/* HEADER */}
      <section className="results-header">
        <div className="container header-inner">
          <div className="header-left">
            <h1 className="h-title">Analysis Complete</h1>
            <p className="header-sub">Here's what we found in your email.</p>
          </div>
          <div className="header-right">
            <div className="time-badge">
              <i className="ti ti-clock" />
              <span>Analyzed just now</span>
            </div>
          </div>
        </div>
      </section>

      {/* RISK SUMMARY CARD */}
      <section className="risk-section">
        <div className="container">
          <RiskSummaryCard />
        </div>
      </section>

      {/* FLAG REASONS */}
      <section className="flag-section">
        <div className="container">
          <FlagReasons />
        </div>
      </section>

      {/* HIGHLIGHTED EMAIL */}
      <section className="email-section">
        <div className="container">
          <HighlightedEmail />
        </div>
      </section>

      {/* RECOMMENDATIONS */}
      <section className="recommendation-section">
        <div className="container">
          <RecommendationCard />
        </div>
      </section>

      {/* AI EXPLANATION */}
      <section className="ai-explanation-section">
        <div className="container">
          <AIExplanationCard />
        </div>
      </section>
    </>
  );
}
