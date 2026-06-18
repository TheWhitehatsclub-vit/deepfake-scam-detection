import re
import io
from PIL import Image
import pytesseract
from typing import Dict, List, Tuple
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Scam keywords and patterns
SCAM_KEYWORDS = [
    'urgent', 'immediate', 'act now', 'limited time', 'expire', 'suspended',
    'verify', 'confirm', 'update', 'secure', 'protect', 'account',
    'payment', 'transfer', 'deposit', 'withdraw', 'bank', 'upi',
    'prize', 'winner', 'lottery', 'reward', 'bonus', 'gift',
    'click here', 'link', 'url', 'http', 'https', 'www',
    'password', 'pin', 'otp', 'verify', 'authenticate',
    'suspicious', 'unusual', 'alert', 'warning', 'security',
    'bitcoin', 'crypto', 'investment', 'trading', 'profit',
    'loan', 'credit', 'debt', 'interest', 'emi',
    'government', 'tax', 'irs', 'income tax', 'gst',
    'arrest', 'legal', 'court', 'police', 'investigation',
    'family emergency', 'hospital', 'medical', 'accident',
    'job offer', 'salary', 'work from home', 'easy money'
]

URGENT_LANGUAGE_PATTERNS = [
    r'urgent|immediate|right now|asap|emergency|critical',
    r'act now|don\'t wait|limited time|expires? soon',
    r'suspend|terminate|block|freeze|close',
    r'final notice|last warning|immediate action'
]

SUSPICIOUS_URL_PATTERNS = [
    r'https?://[^\s]+bit\.ly',
    r'https?://[^\s]+tinyurl',
    r'https?://[^\s]+shortened',
    r'https?://[^\s]+\.(tk|ml|ga|cf|gq)',
    r'https?://[^\s]+[0-9]{2,}\.[a-z]{2,}',
    r'https?://[^\s]*login-[^\s]*',
    r'https?://[^\s]*verify-[^\s]*',
    r'https?://[^\s]*secure-[^\s]*',
    r'https?://[^\s]*account-[^\s]*'
]

PHONE_PATTERNS = [
    r'\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}',
    r'\+?\d{10,15}',
    r'\d{3}[-.\s]?\d{3}[-.\s]?\d{4}'
]

EMAIL_PATTERNS = [
    r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
]

FINANCIAL_PATTERNS = [
    r'₹?\s?\d{1,3}(,\d{3})*(\.\d{2})?',
    r'\$\s?\d{1,3}(,\d{3})*(\.\d{2})?',
    r'upi\s*[:/]\s*[a-zA-Z0-9@]+',
    r'pay\s*to\s*[a-zA-Z0-9@]+',
    r'transfer\s*₹?\s?\d+',
    r'deposit\s*₹?\s?\d+',
    r'account\s*number\s*:?\s*\d{8,18}',
    r'ifsc\s*code\s*:?\s*[A-Z]{4}\d{7}'
]

QR_INDICATORS = [
    'qr code', 'scan', 'barcode', 'quick response'
]


async def analyze_screenshot(file) -> Dict:
    """
    Analyze a screenshot for scam indicators.
    
    Args:
        file: Uploaded file object
    
    Returns:
        Dict with scam analysis results
    """
    try:
        logger.info("Starting screenshot scam analysis")
        
        # Read file
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Extract text using OCR
        text = extract_text_from_image(image)
        logger.info(f"Extracted text length: {len(text)}")
        
        # Analyze for various scam indicators
        findings = []
        scam_score = 0
        
        # 1. Check for scam keywords
        keyword_findings = check_scam_keywords(text)
        findings.extend(keyword_findings['findings'])
        scam_score += keyword_findings['score']
        
        # 2. Check for urgent language
        urgent_findings = check_urgent_language(text)
        findings.extend(urgent_findings['findings'])
        scam_score += urgent_findings['score']
        
        # 3. Check for suspicious URLs
        url_findings = check_suspicious_urls(text)
        findings.extend(url_findings['findings'])
        scam_score += url_findings['score']
        
        # 4. Check for phone numbers
        phone_findings = check_phone_numbers(text)
        findings.extend(phone_findings['findings'])
        scam_score += phone_findings['score']
        
        # 5. Check for email addresses
        email_findings = check_emails(text)
        findings.extend(email_findings['findings'])
        scam_score += email_findings['score']
        
        # 6. Check for financial patterns
        financial_findings = check_financial_patterns(text)
        findings.extend(financial_findings['findings'])
        scam_score += financial_findings['score']
        
        # 7. Check for QR code indicators
        qr_findings = check_qr_indicators(text)
        findings.extend(qr_findings['findings'])
        scam_score += qr_findings['score']
        
        # Cap scam score at 100
        scam_score = min(scam_score, 100)
        
        # Determine risk level
        risk_level = determine_risk_level(scam_score)
        
        # Generate recommendations
        recommendations = generate_recommendations(findings, scam_score)
        
        logger.info(f"Scam analysis complete. Score: {scam_score}, Risk: {risk_level}")
        
        return {
            "scam_score": scam_score,
            "risk_level": risk_level,
            "findings": findings,
            "recommendations": recommendations,
            "extracted_text": text[:500] if text else ""  # First 500 chars for reference
        }
        
    except Exception as e:
        logger.error(f"Screenshot analysis failed: {str(e)}", exc_info=True)
        return {
            "scam_score": 0,
            "risk_level": "low",
            "findings": [{"category": "error", "description": f"Analysis failed: {str(e)}", "severity": "low"}],
            "recommendations": ["Unable to analyze screenshot. Please try again."],
            "extracted_text": ""
        }


def extract_text_from_image(image: Image.Image) -> str:
    """Extract text from image using OCR."""
    try:
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Extract text using Tesseract OCR
        text = pytesseract.image_to_string(image)
        return text.lower()
    except Exception as e:
        logger.error(f"OCR failed: {str(e)}")
        return ""


def check_scam_keywords(text: str) -> Dict:
    """Check for scam keywords in text."""
    findings = []
    score = 0
    
    found_keywords = []
    for keyword in SCAM_KEYWORDS:
        if keyword in text:
            found_keywords.append(keyword)
    
    if found_keywords:
        score = min(len(found_keywords) * 5, 30)
        findings.append({
            "category": "suspicious_keywords",
            "description": f"Found {len(found_keywords)} scam-related keywords: {', '.join(found_keywords[:5])}",
            "severity": "high" if len(found_keywords) >= 5 else "medium",
            "count": len(found_keywords)
        })
    
    return {"findings": findings, "score": score}


def check_urgent_language(text: str) -> Dict:
    """Check for urgent language patterns."""
    findings = []
    score = 0
    
    urgent_matches = []
    for pattern in URGENT_LANGUAGE_PATTERNS:
        matches = re.findall(pattern, text, re.IGNORECASE)
        urgent_matches.extend(matches)
    
    if urgent_matches:
        score = min(len(urgent_matches) * 8, 25)
        findings.append({
            "category": "urgent_language",
            "description": f"Detected urgent language patterns designed to create pressure",
            "severity": "high",
            "count": len(urgent_matches)
        })
    
    return {"findings": findings, "score": score}


def check_suspicious_urls(text: str) -> Dict:
    """Check for suspicious URL patterns."""
    findings = []
    score = 0
    
    suspicious_urls = []
    for pattern in SUSPICIOUS_URL_PATTERNS:
        matches = re.findall(pattern, text, re.IGNORECASE)
        suspicious_urls.extend(matches)
    
    if suspicious_urls:
        score = min(len(suspicious_urls) * 10, 20)
        findings.append({
            "category": "suspicious_urls",
            "description": f"Found {len(suspicious_urls)} potentially suspicious URL patterns",
            "severity": "high",
            "count": len(suspicious_urls)
        })
    
    return {"findings": findings, "score": score}


def check_phone_numbers(text: str) -> Dict:
    """Check for phone numbers."""
    findings = []
    score = 0
    
    phone_matches = []
    for pattern in PHONE_PATTERNS:
        matches = re.findall(pattern, text)
        phone_matches.extend(matches)
    
    # Remove duplicates
    phone_matches = list(set(phone_matches))
    
    if phone_matches:
        score = min(len(phone_matches) * 3, 10)
        findings.append({
            "category": "phone_numbers",
            "description": f"Found {len(phone_matches)} phone number(s)",
            "severity": "low",
            "count": len(phone_matches)
        })
    
    return {"findings": findings, "score": score}


def check_emails(text: str) -> Dict:
    """Check for email addresses."""
    findings = []
    score = 0
    
    email_matches = re.findall(EMAIL_PATTERNS[0], text, re.IGNORECASE)
    
    # Remove duplicates
    email_matches = list(set(email_matches))
    
    if email_matches:
        score = min(len(email_matches) * 3, 10)
        findings.append({
            "category": "email_addresses",
            "description": f"Found {len(email_matches)} email address(es)",
            "severity": "low",
            "count": len(email_matches)
        })
    
    return {"findings": findings, "score": score}


def check_financial_patterns(text: str) -> Dict:
    """Check for financial patterns."""
    findings = []
    score = 0
    
    financial_matches = []
    for pattern in FINANCIAL_PATTERNS:
        matches = re.findall(pattern, text, re.IGNORECASE)
        financial_matches.extend(matches)
    
    if financial_matches:
        score = min(len(financial_matches) * 8, 20)
        findings.append({
            "category": "financial_patterns",
            "description": f"Found {len(financial_matches)} financial pattern(s) - possible payment request",
            "severity": "high",
            "count": len(financial_matches)
        })
    
    return {"findings": findings, "score": score}


def check_qr_indicators(text: str) -> Dict:
    """Check for QR code indicators."""
    findings = []
    score = 0
    
    qr_matches = []
    for indicator in QR_INDICATORS:
        if indicator in text:
            qr_matches.append(indicator)
    
    if qr_matches:
        score = min(len(qr_matches) * 5, 10)
        findings.append({
            "category": "qr_indicators",
            "description": "Text suggests QR code or barcode presence - verify before scanning",
            "severity": "medium",
            "count": len(qr_matches)
        })
    
    return {"findings": findings, "score": score}


def determine_risk_level(score: int) -> str:
    """Determine risk level based on scam score."""
    if score >= 70:
        return "high"
    elif score >= 40:
        return "medium"
    else:
        return "low"


def generate_recommendations(findings: List[Dict], score: int) -> List[str]:
    """Generate recommendations based on findings."""
    recommendations = []
    
    if score >= 70:
        recommendations.append("⚠️ HIGH RISK: This screenshot shows strong indicators of a scam.")
        recommendations.append("Do not click any links or provide any personal information.")
        recommendations.append("Verify the source through official channels before taking any action.")
        recommendations.append("Report this to the appropriate authorities if possible.")
    elif score >= 40:
        recommendations.append("⚡ MEDIUM RISK: This screenshot contains some suspicious elements.")
        recommendations.append("Exercise caution and verify the authenticity of the message.")
        recommendations.append("Do not share sensitive information without proper verification.")
        recommendations.append("Contact the supposed sender through official channels to confirm.")
    else:
        recommendations.append("✅ LOW RISK: No significant scam indicators detected.")
        recommendations.append("Still, always verify the source before taking action.")
        recommendations.append("Be cautious with unsolicited messages requesting personal or financial information.")
    
    # Add specific recommendations based on findings
    categories = set(f['category'] for f in findings)
    
    if 'suspicious_urls' in categories:
        recommendations.append("🔗 Avoid clicking on suspicious links - they may lead to phishing sites.")
    
    if 'financial_patterns' in categories:
        recommendations.append("💰 Never make payments based on unsolicited screenshots.")
    
    if 'urgent_language' in categories:
        recommendations.append("⏰ Scammers often use urgency to pressure victims - take time to verify.")
    
    if 'phone_numbers' in categories:
        recommendations.append("📱 Verify phone numbers through official directories before calling.")
    
    if 'email_addresses' in categories:
        recommendations.append("📧 Check email addresses carefully for slight misspellings or unusual domains.")
    
    return recommendations
