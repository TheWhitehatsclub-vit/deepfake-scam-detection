from urllib.parse import urlparse, unquote

HIGH_RISK = ["verify-account", "login-secure", "account-suspended", "update-payment",
             "confirm-identity", "unlock-account", "security-alert", "free-money",
             "prize-winner", "claim-reward", "limited-offer", "urgent-action"]

MEDIUM_RISK = ["verify", "secure", "login", "account", "update", "confirm",
               "banking", "payment", "password", "signin", "authenticate",
               "wallet", "reward", "bonus", "lucky", "winner", "gift"]

def check_keywords(url: str) -> dict:
    url_lower = unquote(url.lower())
    found_high = [kw for kw in HIGH_RISK if kw in url_lower]
    found_medium = [kw for kw in MEDIUM_RISK if kw in url_lower]

    score = (len(found_high) * 25) + (len(found_medium) * 10)
    score = min(score, 100)

    all_found = found_high + found_medium
    if not all_found:
        return {"score": 0, "status": "safe", "details": "No suspicious keywords detected.", "keywords_found": []}
    elif score >= 50:
        return {"score": score, "status": "danger", "details": f"High-risk keywords found: {', '.join(all_found)}", "keywords_found": all_found}
    else:
        return {"score": score, "status": "warning", "details": f"Suspicious keywords found: {', '.join(all_found)}", "keywords_found": all_found}