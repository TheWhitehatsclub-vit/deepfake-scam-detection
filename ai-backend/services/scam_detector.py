import re


def detect_scam(text: str):
    text = text.lower()

    tactics = []
    score = 0
    if "amazon" in text:
        score += 10
    if "paypal" in text:
        score += 10

    # Urgency
    urgency = [
        "24 hours",
        "urgent",
        "immediately",
        "limited time",
        "act now",
        "expires",
        "disabled",
        "suspended",
        "account access has been limited"
    ]

    # Fear
    fear = [
    "danger",
    "unauthorized users",
    "blocked",
    "disabled",
    "limited",
    "security alert",
    "your account is limited",
    "unusual activity",
    "fraudulent",
    "terminate",
    "foreign ip",
    "investigation",
    "real owner"
]

    # Credential phishing
    credential = [
    "confirm your information",
    "confirm your account",
    "verify account",
    "account details",
    "password",
    "otp",
    "pin",
    "login",
    "secured server",
    "confirm that you are",
    "real owner",
    "complete the following form",
    "security fraud prevention"
]

    # Reward scams
    reward = [
        "won",
        "reward",
        "prize",
        "lottery",
        "bonus",
        "gift"
    ]

    # Brand impersonation
    brands = [
    "paypal",
    "google",
    "amazon",
    "amazon.com",
    "microsoft",
    "netflix",
    "apple",
    "bank"
]

    # URLs
    urls = re.findall(
    r'https?://\S+|www\.\S+|bit\.ly/\S+|tinyurl\.com/\S+',
    text
)

    # Urgency
    if any(x in text for x in urgency):
        tactics.append("Urgency")
        score += 25

    # Fear
    if any(x in text for x in fear):
        tactics.append("Fear")
        score += 20

    # Credential phishing
    if any(x in text for x in credential):
        tactics.append("Credential Phishing")
        score += 30

    # Reward scam
    if any(x in text for x in reward):
        tactics.append("Reward Scam")
        score += 20

    # Brand impersonation
    if any(x in text for x in brands):
        tactics.append("Brand Impersonation")
        score += 20

    # Suspicious links
    if len(urls) > 0:
        tactics.append("Suspicious Link")
        score += 20
    if "amazon" in text and (
        "limited" in text
        or "verify" in text
        or "confirm" in text
    ):
        score += 30
        tactics.append(
            "Amazon Phishing"
    )

    if "paypal" in text and (
        "limited" in text
        or "verify" in text
        or "confirm" in text
    ):
        score += 30
        tactics.append(
            "PayPal Phishing"
        )

    score = min(score, 100)

    return {
        "scam_probability": score,
        "tactics": tactics,
        "urls_found": len(urls)
    }