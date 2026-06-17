import type { Metadata } from 'next';
import Link from 'next/link';
import './deepfake.css';

export const metadata: Metadata = {
  title: 'Deepfake Detection – TrustShield AI',
  description: 'Detect deepfakes in any image or video, frame by frame, with authenticity scoring, Grad-CAM heatmaps, and an explainable AI report.',
};

export default function DeepfakeDetectionPage() {
  return (
    <>
      <div className="crumb-bar">
        <div className="container">
          <div className="crumb">
            <Link href="/">Home</Link>
            <i className="ti ti-chevron-right" />
            <Link href="/features">Features</Link>
            <i className="ti ti-chevron-right" />
            <span className="current">Deepfake Image / Video Detection</span>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <div className="hero-icon-badge"><i className="ti ti-face-id" /></div>
            <div className="eyebrow-pill"><span className="dot" />MODULE 01 · DEEPFAKE DETECTION</div>
            <h1 className="h-title">Detect <span className="grad-text">deepfakes</span> in any image or video, frame by frame.</h1>
            <p className="hero-sub">Upload a photo or video clip and our model inspects facial geometry, blink timing, lighting consistency, and compression artifacts — then explains exactly what it found, with visual proof.</p>
            <div className="hero-stats">
              <div className="hero-stat"><strong>99.1%</strong><span>Model accuracy</span></div>
              <div className="hero-stat"><strong>2.8s</strong><span>Avg. analysis time</span></div>
              <div className="hero-stat"><strong>14</strong><span>Detection signals</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* WORKSPACE: upload panel + live scan panel */}
      <section className="workspace">
        <div className="container ws-grid">

          {/* LEFT: Upload */}
          <div className="panel">
            <div className="panel-head">
              <h3><i className="ti ti-upload" />Image Upload</h3>
              <span className="panel-tag">STEP 1</span>
            </div>
            <div className="dropzone">
              <div className="dropzone-icon"><i className="ti ti-cloud-upload" /></div>
              <strong>Drop your image or video here</strong>
              <p>or click to browse from your device</p>
              <div className="format-tags">
                <span className="format-tag">JPG</span>
                <span className="format-tag">PNG</span>
                <span className="format-tag">MP4</span>
                <span className="format-tag">WEBM</span>
                <span className="format-tag">Max 200MB</span>
              </div>
            </div>
            <div className="model-row">
              <div className="model-chip">
                <div className="model-chip-left"><i className="ti ti-cpu" /><span>Deepfake Detection Model</span></div>
                <span className="status">ACTIVE</span>
              </div>
              <div className="model-chip">
                <div className="model-chip-left"><i className="ti ti-face-id" /><span>Face Detection Engine</span></div>
                <span className="status">ACTIVE</span>
              </div>
              <div className="model-chip">
                <div className="model-chip-left"><i className="ti ti-file-info" /><span>Metadata Analyzer</span></div>
                <span className="status">ACTIVE</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Live scan preview */}
          <div className="panel">
            <div className="panel-head">
              <h3><i className="ti ti-scan" />Live Analysis</h3>
              <span className="panel-tag">PROCESSING</span>
            </div>
            <div className="preview-frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=700&h=480&fit=crop" alt="Face being analyzed for deepfake markers" />
              <div className="grid-overlay" />
              <div className="face-box" data-label="FACE_01 · 94%" style={{ top: '14%', left: '30%', width: '38%', height: '55%' }} />
              <div className="scan-sweep" />
              <div className="preview-tag"><span className="rec" />analyzing_frame_142.jpg</div>
            </div>
            <div className="progress-row">
              <div className="progress-item">
                <i className="ti ti-circle-check" />
                <div className="ptext"><strong>Face detection</strong><div className="progress-bar-track"><div className="progress-bar-fill" style={{ width: '100%' }} /></div></div>
              </div>
              <div className="progress-item">
                <i className="ti ti-circle-check" />
                <div className="ptext"><strong>Artifact scanning</strong><div className="progress-bar-track"><div className="progress-bar-fill" style={{ width: '100%' }} /></div></div>
              </div>
              <div className="progress-item">
                <i className="ti ti-loader-2" />
                <div className="ptext"><strong>Generating Grad-CAM heatmap</strong><div className="progress-bar-track"><div className="progress-bar-fill" style={{ width: '72%' }} /></div></div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* VERDICT BANNER */}
      <section className="results-strip">
        <div className="container">
          <div className="verdict-banner">
            <div className="verdict-left">
              <div className="verdict-icon"><i className="ti ti-alert-triangle" /></div>
              <div>
                <strong>Likely manipulated — high risk detected</strong>
                <span>3 of 14 signals flagged · review the breakdown below before trusting this content</span>
              </div>
            </div>
            <div className="verdict-actions">
              <a className="btn-outline"><i className="ti ti-download" style={{ fontSize: 14 }} />Download Report</a>
              <a className="btn-primary"><i className="ti ti-layout-dashboard" style={{ fontSize: 14 }} />Open Dashboard</a>
            </div>
          </div>
        </div>
      </section>

      {/* SCORE CARDS */}
      <section className="score-row">
        <div className="container score-grid">

          <div className="score-card">
            <div className="score-card-head"><span><i className="ti ti-certificate" style={{ color: 'var(--purple-light)' }} />Authenticity Score</span></div>
            <div className="ring-wrap">
              <div className="ring">
                <svg width="88" height="88"><circle cx="44" cy="44" r="38" stroke="rgba(255,255,255,0.07)" strokeWidth="8" fill="none" /><circle cx="44" cy="44" r="38" stroke="#F0594F" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray="238.7" strokeDashoffset="170" /></svg>
                <div className="ring-num">29%</div>
              </div>
              <div className="ring-label">
                <strong>29% authentic</strong>
                <span>Significant inconsistencies found across facial regions</span>
                <span className="badge badge-red">Low authenticity</span>
              </div>
            </div>
          </div>

          <div className="score-card">
            <div className="score-card-head"><span><i className="ti ti-target-arrow" style={{ color: 'var(--blue-accent)' }} />Confidence Score</span></div>
            <div className="ring-wrap">
              <div className="ring">
                <svg width="88" height="88"><circle cx="44" cy="44" r="38" stroke="rgba(255,255,255,0.07)" strokeWidth="8" fill="none" /><circle cx="44" cy="44" r="38" stroke="#3B82F6" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray="238.7" strokeDashoffset="14" /></svg>
                <div className="ring-num">94%</div>
              </div>
              <div className="ring-label">
                <strong>94% model confidence</strong>
                <span>High certainty in this prediction based on signal strength</span>
                <span className="badge badge-teal">High confidence</span>
              </div>
            </div>
          </div>

          <div className="score-card">
            <div className="score-card-head"><span><i className="ti ti-shield-exclamation" style={{ color: 'var(--orange-accent)' }} />Risk Level</span></div>
            <div className="ring-wrap">
              <div className="ring">
                <svg width="88" height="88"><circle cx="44" cy="44" r="38" stroke="rgba(255,255,255,0.07)" strokeWidth="8" fill="none" /><circle cx="44" cy="44" r="38" stroke="#F0934A" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray="238.7" strokeDashoffset="48" /></svg>
                <div className="ring-num"><i className="ti ti-flame" style={{ fontSize: 26, color: 'var(--orange-accent)' }} /></div>
              </div>
              <div className="ring-label">
                <strong>High risk</strong>
                <span>Recommended action: do not share or trust without verification</span>
                <span className="badge badge-orange">Needs review</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FACE DETECTION + GRAD-CAM */}
      <section className="ds-section">
        <div className="container">
          <div className="section-head-row">
            <div>
              <h2><i className="ti ti-flame" />Grad-CAM heatmap &amp; face analysis</h2>
              <p>Visual proof of exactly which regions triggered the model&apos;s decision.</p>
            </div>
            <span className="tab-link">View full resolution <i className="ti ti-arrow-right" /></span>
          </div>

          <div className="twocol">
            <div>
              <div className="heatmap-frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=700&h=520&fit=crop" alt="Grad-CAM heatmap over the analyzed face" />
                <div className="heatmap-overlay" />
              </div>
              <div className="heatmap-legend">
                <div className="legend-item"><span className="legend-swatch" style={{ background: '#F0594F' }} />High activation</div>
                <div className="legend-item"><span className="legend-swatch" style={{ background: '#F0934A' }} />Medium activation</div>
                <div className="legend-item"><span className="legend-swatch" style={{ background: '#14C8A8' }} />Low activation</div>
              </div>
            </div>

            <div className="face-list">
              <div className="face-row">
                <div className="face-thumb"><i className="ti ti-user" /></div>
                <div className="face-info"><strong>Face 01 — primary subject</strong><span>Eye region · mouth boundary flagged</span></div>
                <div className="face-score" style={{ color: '#F0594F' }}>81% fake</div>
              </div>
              <div className="face-row">
                <div className="face-thumb"><i className="ti ti-aspect-ratio" /></div>
                <div className="face-info"><strong>Landmark consistency</strong><span>68 facial points tracked across frames</span></div>
                <div className="face-score" style={{ color: '#F0934A' }}>Moderate drift</div>
              </div>
              <div className="face-row">
                <div className="face-thumb"><i className="ti ti-eye" /></div>
                <div className="face-info"><strong>Blink pattern analysis</strong><span>Irregular interval detected at frame 89–142</span></div>
                <div className="face-score" style={{ color: '#F0594F' }}>Anomaly</div>
              </div>
              <div className="face-row">
                <div className="face-thumb"><i className="ti ti-bulb" /></div>
                <div className="face-info"><strong>Lighting &amp; shadow consistency</strong><span>Mismatched light source direction on jawline</span></div>
                <div className="face-score" style={{ color: '#F0934A' }}>Flagged</div>
              </div>
              <a href="#" className="btn-outline" style={{ marginTop: 6, justifyContent: 'center' }}>View full face analysis report</a>
            </div>
          </div>
        </div>
      </section>

      {/* AI ARTIFACTS + METADATA */}
      <section className="ds-section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head-row">
            <div>
              <h2><i className="ti ti-binary" />AI artifact detection &amp; metadata</h2>
              <p>Pixel-level forensics and file-level evidence, side by side.</p>
            </div>
          </div>

          <div className="twocol">
            <div className="panel" style={{ padding: 24 }}>
              <div className="panel-head" style={{ marginBottom: 16 }}><h3 style={{ fontSize: 14 }}><i className="ti ti-binary" />AI artifact signals</h3></div>
              <div className="artifact-grid">
                <div className="artifact-card artifact-detected">
                  <div className="artifact-icon"><i className="ti ti-grid-dots" /></div>
                  <div className="artifact-text"><strong>GAN fingerprint</strong><span>Periodic noise pattern typical of generative models</span></div>
                </div>
                <div className="artifact-card artifact-detected">
                  <div className="artifact-icon"><i className="ti ti-border-corners" /></div>
                  <div className="artifact-text"><strong>Boundary blending</strong><span>Soft edge artifacts around face-swap region</span></div>
                </div>
                <div className="artifact-card artifact-clear">
                  <div className="artifact-icon"><i className="ti ti-color-swatch" /></div>
                  <div className="artifact-text"><strong>Color consistency</strong><span>Skin tone matches across all frames</span></div>
                </div>
                <div className="artifact-card artifact-detected">
                  <div className="artifact-icon"><i className="ti ti-wave-square" /></div>
                  <div className="artifact-text"><strong>Compression mismatch</strong><span>Double JPEG compression signature found</span></div>
                </div>
              </div>
            </div>

            <div className="panel" style={{ padding: 24 }}>
              <div className="panel-head" style={{ marginBottom: 8 }}><h3 style={{ fontSize: 14 }}><i className="ti ti-file-info" />Metadata analysis</h3></div>
              <table className="meta-table">
                <tbody>
                  <tr><td>File name</td><td>analyzing_frame_142.jpg</td></tr>
                  <tr><td>Created</td><td>2026-06-14 19:22:08</td></tr>
                  <tr><td>Modified</td><td className="meta-flag">2026-06-16 03:11:52 ⚠</td></tr>
                  <tr><td>Editing software</td><td className="meta-flag">Unknown / stripped ⚠</td></tr>
                  <tr><td>Camera model</td><td>Not present</td></tr>
                  <tr><td>GPS data</td><td>Not present</td></tr>
                  <tr><td>Resolution</td><td>1920 × 1080</td></tr>
                  <tr><td>File hash (SHA-256)</td><td>a4f9...e21c</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* EXPLAINABLE AI REPORT */}
      <section className="ds-section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head-row">
            <div>
              <h2><i className="ti ti-message-report" />Explainable AI report</h2>
              <p>In plain language — why the model reached this verdict, ranked by impact.</p>
            </div>
          </div>

          <div className="report-panel">
            <div className="report-list">
              <div className="report-item">
                <div className="report-num">01</div>
                <div className="report-text"><strong>Inconsistent blink timing</strong><p>The subject&apos;s blink interval breaks natural rhythm between frames 89 and 142 — a common signature of frame-interpolated deepfakes.</p></div>
                <div className="report-weight">Impact: 34%</div>
              </div>
              <div className="report-item">
                <div className="report-num">02</div>
                <div className="report-text"><strong>GAN-style pixel noise pattern</strong><p>A periodic high-frequency noise pattern was detected around the eyes and mouth, consistent with generative adversarial network output.</p></div>
                <div className="report-weight">Impact: 28%</div>
              </div>
              <div className="report-item">
                <div className="report-num">03</div>
                <div className="report-text"><strong>Mismatched lighting direction</strong><p>Shadows on the jawline suggest a light source angle that doesn&apos;t match the rest of the scene&apos;s lighting setup.</p></div>
                <div className="report-weight">Impact: 19%</div>
              </div>
              <div className="report-item">
                <div className="report-num">04</div>
                <div className="report-text"><strong>Edited file metadata</strong><p>The file was modified roughly 32 hours after creation using software that stripped its original editing signature.</p></div>
                <div className="report-weight">Impact: 12%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ANALYSIS HISTORY */}
      <section className="ds-section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head-row">
            <div>
              <h2><i className="ti ti-history" />Analysis history</h2>
              <p>Your past scans, available anytime from your dashboard.</p>
            </div>
            <span className="tab-link">View all <i className="ti ti-arrow-right" /></span>
          </div>

          <div className="panel" style={{ padding: '8px 28px 20px' }}>
            <table className="history-table">
              <thead>
                <tr><th>File</th><th>Date</th><th>Authenticity</th><th>Risk</th><th>Report</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td><div className="file-cell"><div className="file-icon"><i className="ti ti-photo" /></div><div><strong>analyzing_frame_142.jpg</strong><span>2.4 MB</span></div></div></td>
                  <td>16 Jun 2026</td>
                  <td><span className="badge badge-red">29% authentic</span></td>
                  <td><span className="badge badge-orange">High</span></td>
                  <td><span className="dl-btn"><i className="ti ti-download" />PDF</span></td>
                </tr>
                <tr>
                  <td><div className="file-cell"><div className="file-icon"><i className="ti ti-video" /></div><div><strong>interview_clip_03.mp4</strong><span>18.1 MB</span></div></div></td>
                  <td>14 Jun 2026</td>
                  <td><span className="badge badge-teal">96% authentic</span></td>
                  <td><span className="badge" style={{ background: 'rgba(20,200,168,0.15)', color: '#5EEAD0' }}>Low</span></td>
                  <td><span className="dl-btn"><i className="ti ti-download" />PDF</span></td>
                </tr>
                <tr>
                  <td><div className="file-cell"><div className="file-icon"><i className="ti ti-photo" /></div><div><strong>profile_picture_v2.png</strong><span>0.9 MB</span></div></div></td>
                  <td>11 Jun 2026</td>
                  <td><span className="badge badge-orange">61% authentic</span></td>
                  <td><span className="badge badge-orange">Medium</span></td>
                  <td><span className="dl-btn"><i className="ti ti-download" />PDF</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-final">
        <div className="container">
          <div className="cta-box">
            <h2>Ready to verify your own content?</h2>
            <p>Upload an image or video above, or explore the other three detection modules.</p>
            <div className="cta-box-actions">
              <Link href="/features" className="btn-outline btn-lg">Explore all features</Link>
              <a className="btn-primary btn-lg"><i className="ti ti-upload" style={{ fontSize: 14 }} />Upload &amp; scan now</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
