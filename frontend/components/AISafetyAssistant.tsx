'use client';

interface SafetyGuidance {
  whatDetected: string;
  whyRisky: string;
  whatToDo: string;
  verificationSteps: string[];
}

interface AISafetyAssistantProps {
  riskLevel: 'low' | 'medium' | 'high';
  analysisType: 'deepfake' | 'screenshot';
  findings?: any;
}

export default function AISafetyAssistant({ riskLevel, analysisType, findings }: AISafetyAssistantProps) {
  const getGuidance = (): SafetyGuidance => {
    if (analysisType === 'deepfake') {
      return getDeepfakeGuidance(riskLevel, findings);
    } else {
      return getScreenshotGuidance(riskLevel, findings);
    }
  };

  const guidance = getGuidance();

  const riskColor = riskLevel === 'high' ? '#F0594F' : 
                   riskLevel === 'medium' ? '#F0934A' : '#14C8A8';

  const riskIcon = riskLevel === 'high' ? 'ti ti-alert-triangle' : 
                   riskLevel === 'medium' ? 'ti ti-alert-circle' : 'ti ti-shield-check';

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: `1px solid ${riskColor}40`,
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '24px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: `${riskColor}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <i className={riskIcon} style={{ fontSize: '24px', color: riskColor }} />
        </div>
        <div>
          <div style={{ fontSize: '14px', color: '#888', marginBottom: '4px' }}>AI SAFETY ASSISTANT</div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#fff' }}>
            Cybersecurity Guidance
          </div>
        </div>
        <div style={{
          marginLeft: 'auto',
          padding: '6px 16px',
          borderRadius: '20px',
          background: `${riskColor}20`,
          color: riskColor,
          fontSize: '12px',
          fontWeight: '600',
          textTransform: 'uppercase'
        }}>
          {riskLevel} Risk
        </div>
      </div>

      <div style={{ display: 'grid', gap: '20px' }}>
        {/* What Was Detected */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          padding: '16px',
          borderLeft: `3px solid ${riskColor}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <i className="ti ti-search" style={{ color: riskColor }} />
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>
              What Was Detected
            </div>
          </div>
          <div style={{ fontSize: '14px', color: '#ccc', lineHeight: '1.6' }}>
            {guidance.whatDetected}
          </div>
        </div>

        {/* Why It Is Risky */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          padding: '16px',
          borderLeft: `3px solid ${riskColor}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <i className="ti ti-alert-circle" style={{ color: riskColor }} />
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>
              Why It Is Risky
            </div>
          </div>
          <div style={{ fontSize: '14px', color: '#ccc', lineHeight: '1.6' }}>
            {guidance.whyRisky}
          </div>
        </div>

        {/* What User Should Do Next */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          padding: '16px',
          borderLeft: `3px solid ${riskColor}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <i className="ti ti-directions" style={{ color: riskColor }} />
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>
              What You Should Do Next
            </div>
          </div>
          <div style={{ fontSize: '14px', color: '#ccc', lineHeight: '1.6' }}>
            {guidance.whatToDo}
          </div>
        </div>

        {/* Verification Steps */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          padding: '16px',
          borderLeft: `3px solid ${riskColor}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <i className="ti ti-checklist" style={{ color: riskColor }} />
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>
              Verification Steps
            </div>
          </div>
          <ul style={{ 
            listStyle: 'none', 
            padding: 0, 
            margin: 0,
            display: 'grid',
            gap: '8px'
          }}>
            {guidance.verificationSteps.map((step, index) => (
              <li key={index} style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '12px',
                fontSize: '14px',
                color: '#ccc'
              }}>
                <span style={{ 
                  color: riskColor, 
                  fontWeight: '600',
                  flexShrink: 0
                }}>
                  {index + 1}.
                </span>
                {step}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function getDeepfakeGuidance(riskLevel: 'low' | 'medium' | 'high', findings?: any): SafetyGuidance {
  if (riskLevel === 'high') {
    return {
      whatDetected: 'Strong indicators of AI-generated or manipulated content detected. The image shows patterns consistent with deepfake generation techniques.',
      whyRisky: 'Deepfakes can be used for misinformation, fraud, identity theft, or reputation damage. High-risk images may contain manipulated faces, backgrounds, or other elements designed to deceive.',
      whatToDo: 'Do not trust this image without verification. Do not share or act on the content. Report the source if possible.',
      verificationSteps: [
        'Contact the supposed source through official channels to confirm authenticity',
        'Check for metadata inconsistencies or missing information',
        'Use reverse image search to find original sources',
        'Look for visual anomalies like unnatural facial movements or lighting',
        'Verify with multiple independent sources before taking any action'
      ]
    };
  } else if (riskLevel === 'medium') {
    return {
      whatDetected: 'Some potential manipulation indicators detected. The image may contain elements that warrant further investigation.',
      whyRisky: 'Medium-risk images could be partially manipulated or contain suspicious elements. While not definitively fake, they require caution.',
      whatToDo: 'Cross-check source before sharing. Exercise caution and verify the authenticity through reliable channels.',
      verificationSteps: [
        'Verify the source of the image through official channels',
        'Check if the image appears in other contexts with different claims',
        'Examine metadata for editing software traces',
        'Compare with known authentic versions if available',
        'Consider the context and timing of the image distribution'
      ]
    };
  } else {
    return {
      whatDetected: 'No major manipulation indicators detected. The image appears to be authentic based on current analysis.',
      whyRisky: 'Low risk indicates the image likely shows minimal manipulation. However, no detection method is 100% foolproof.',
      whatToDo: 'No major manipulation indicators detected. Still practice basic verification habits for important content.',
      verificationSteps: [
        'Consider the source and context of the image',
        'For sensitive content, perform additional verification',
        'Check metadata for any unusual editing traces',
        'Be aware of the limitations of detection technology',
        'Trust your instincts if something seems off'
      ]
    };
  }
}

function getScreenshotGuidance(riskLevel: 'low' | 'medium' | 'high', findings?: any): SafetyGuidance {
  if (riskLevel === 'high') {
    return {
      whatDetected: 'Multiple scam indicators detected including suspicious URLs, urgent language, financial requests, or phishing patterns.',
      whyRisky: 'High-risk screenshots often contain phishing links, fake payment requests, or social engineering tactics designed to steal personal/financial information.',
      whatToDo: 'Do not trust this image without verification. Do not click any links or provide any information. Report to appropriate authorities.',
      verificationSteps: [
        'Never click on links in suspicious screenshots',
        'Verify phone numbers through official directories before contacting',
        'Check email addresses for slight misspellings or unusual domains',
        'Contact organizations through official websites, not screenshots',
        'Report phishing attempts to relevant platforms and authorities'
      ]
    };
  } else if (riskLevel === 'medium') {
    return {
      whatDetected: 'Some suspicious elements detected. The screenshot contains patterns that warrant caution and further verification.',
      whyRisky: 'Medium-risk screenshots may contain misleading information, urgent language designed to pressure victims, or questionable requests.',
      whatToDo: 'Cross-check source before sharing or acting. Exercise caution and verify through official channels.',
      verificationSteps: [
        'Verify the claimed source through official channels',
        'Check for urgency or pressure tactics - these are red flags',
        'Research the organization or individual independently',
        'Look for inconsistencies in the information presented',
        'Consult with trusted advisors before taking financial actions'
      ]
    };
  } else {
    return {
      whatDetected: 'No significant scam indicators detected. The screenshot appears to be legitimate based on current analysis.',
      whyRisky: 'Low risk indicates minimal scam patterns. However, always be cautious with unsolicited communications requesting information or payments.',
      whatToDo: 'No major manipulation indicators detected. Still practice basic security habits for all digital communications.',
      verificationSteps: [
        'Be cautious with unsolicited messages even if they appear legitimate',
        'Verify sensitive requests through multiple channels',
        'Keep your software and security tools updated',
        'Monitor your accounts for any unusual activity',
        'Educate yourself about common scam tactics'
      ]
    };
  }
}
