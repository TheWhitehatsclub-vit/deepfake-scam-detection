'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ScreenshotAnalysisResponse, ScamFinding } from '@/types/screenshot';
import AISafetyAssistant from '@/components/AISafetyAssistant';
import './results.css';

export default function ScreenshotResultsPage() {
  const [analysisData, setAnalysisData] = useState<ScreenshotAnalysisResponse | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve analysis results from sessionStorage
    const storedResults = sessionStorage.getItem('screenshotAnalysisResults');
    const storedPreview = sessionStorage.getItem('screenshotPreview');
    
    if (storedResults) {
      setAnalysisData(JSON.parse(storedResults));
    }
    if (storedPreview) {
      setScreenshotPreview(storedPreview);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#fff'
      }}>
        Loading...
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#fff',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <i className="ti ti-alert-circle" style={{ fontSize: 48 }} />
        <p>No analysis results found. Please upload a screenshot first.</p>
        <Link href="/screenshot-analysis" className="btn-primary">
          Upload Screenshot
        </Link>
      </div>
    );
  }

  const riskColor = analysisData.risk_level === 'high' ? '#F0594F' : 
                   analysisData.risk_level === 'medium' ? '#F0934A' : '#14C8A8';

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
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            border: `2px solid ${riskColor}`,
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '64px', 
              fontWeight: '700', 
              color: riskColor,
              marginBottom: '8px'
            }}>
              {analysisData.scam_score || 0}
            </div>
            <div style={{ 
              fontSize: '18px', 
              color: '#fff', 
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '2px'
            }}>
              Scam Score
            </div>
            <div style={{
              display: 'inline-block',
              padding: '8px 24px',
              borderRadius: '24px',
              background: riskColor,
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              textTransform: 'uppercase'
            }}>
              {analysisData.risk_level} Risk
            </div>
          </div>
        </div>
      </section>

      {/* AI SAFETY ASSISTANT */}
      {analysisData.risk_level && (
        <section className="safety-section">
          <div className="container">
            <AISafetyAssistant 
              riskLevel={analysisData.risk_level} 
              analysisType="screenshot"
              findings={analysisData}
            />
          </div>
        </section>
      )}

      {/* SCREENSHOT PREVIEW */}
      {screenshotPreview && (
        <section className="screenshot-section">
          <div className="container">
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              <h3 style={{ 
                color: '#fff', 
                marginBottom: '16px',
                fontSize: '18px'
              }}>
                Uploaded Screenshot
              </h3>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={screenshotPreview} 
                alt="Analyzed screenshot" 
                style={{ 
                  width: '100%', 
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              />
            </div>
          </div>
        </section>
      )}

      {/* FINDINGS */}
      {analysisData.findings && analysisData.findings.length > 0 && (
        <section className="findings-section">
          <div className="container">
            <h2 style={{ 
              color: '#fff', 
              marginBottom: '24px',
              fontSize: '24px'
            }}>
              Detected Issues
            </h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              {analysisData.findings.map((finding: ScamFinding, index: number) => (
                <div key={index} style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${finding.severity === 'high' ? '#F0594F' : finding.severity === 'medium' ? '#F0934A' : '#14C8A8'}`,
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: finding.severity === 'high' ? 'rgba(240, 89, 79, 0.2)' : finding.severity === 'medium' ? 'rgba(240, 147, 74, 0.2)' : 'rgba(20, 200, 168, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <i className={`ti ti-${finding.severity === 'high' ? 'alert-triangle' : finding.severity === 'medium' ? 'alert-circle' : 'check'}`} 
                       style={{ 
                         color: finding.severity === 'high' ? '#F0594F' : finding.severity === 'medium' ? '#F0934A' : '#14C8A8',
                         fontSize: '20px'
                       }} 
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      color: '#fff', 
                      fontWeight: '600', 
                      marginBottom: '8px',
                      textTransform: 'capitalize'
                    }}>
                      {finding.category.replace('_', ' ')}
                    </div>
                    <div style={{ color: '#888', fontSize: '14px' }}>
                      {finding.description}
                    </div>
                    {finding.count !== undefined && (
                      <div style={{ 
                        marginTop: '8px', 
                        fontSize: '12px', 
                        color: '#888' 
                      }}>
                        Count: {finding.count}
                      </div>
                    )}
                  </div>
                  <div style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    background: finding.severity === 'high' ? 'rgba(240, 89, 79, 0.2)' : finding.severity === 'medium' ? 'rgba(240, 147, 74, 0.2)' : 'rgba(20, 200, 168, 0.2)',
                    color: finding.severity === 'high' ? '#F0594F' : finding.severity === 'medium' ? '#F0934A' : '#14C8A8',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}>
                    {finding.severity}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RECOMMENDATIONS */}
      {analysisData.recommendations && analysisData.recommendations.length > 0 && (
        <section className="recommendations-section">
          <div className="container">
            <h2 style={{ 
              color: '#fff', 
              marginBottom: '24px',
              fontSize: '24px'
            }}>
              Recommendations
            </h2>
            <div style={{
              background: 'rgba(20, 200, 168, 0.1)',
              border: '1px solid #14C8A8',
              borderRadius: '12px',
              padding: '24px'
            }}>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0, 
                margin: 0 
              }}>
                {analysisData.recommendations.map((recommendation: string, index: number) => (
                  <li key={index} style={{ 
                    color: '#fff', 
                    marginBottom: '12px',
                    paddingLeft: '24px',
                    position: 'relative',
                    fontSize: '15px'
                  }}>
                    <span style={{ 
                      position: 'absolute', 
                      left: 0, 
                      color: '#14C8A8' 
                    }}>
                      ✓
                    </span>
                    {recommendation}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* EXTRACTED TEXT */}
      {analysisData.extracted_text && (
        <section className="text-section">
          <div className="container">
            <h2 style={{ 
              color: '#fff', 
              marginBottom: '24px',
              fontSize: '24px'
            }}>
              Extracted Text
            </h2>
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '20px',
              color: '#888',
              fontFamily: 'monospace',
              fontSize: '14px',
              lineHeight: '1.6',
              maxHeight: '300px',
              overflow: 'auto'
            }}>
              {analysisData.extracted_text}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
