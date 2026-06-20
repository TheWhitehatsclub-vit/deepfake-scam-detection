import whois
from datetime import datetime, timezone

def check_domain_age(domain: str) -> dict:
    try:
        w = whois.whois(domain)
        creation = w.creation_date
        if isinstance(creation, list):
            creation = creation[0]
        if creation is None:
            return {"score": 40, "status": "warning", "details": "Could not determine domain age — WHOIS data unavailable.", "age_days": None}

        # make both timezone-aware for safe subtraction
        if creation.tzinfo is None:
            creation = creation.replace(tzinfo=timezone.utc)
        now = datetime.now(timezone.utc)
        age_days = (now - creation).days

        if age_days < 30:
            return {"score": 90, "status": "danger", "details": f"Domain is only {age_days} days old — very high risk.", "age_days": age_days}
        elif age_days < 180:
            return {"score": 55, "status": "warning", "details": f"Domain is {age_days} days old — relatively new.", "age_days": age_days}
        elif age_days < 365:
            return {"score": 25, "status": "warning", "details": f"Domain is {age_days} days old — moderate age.", "age_days": age_days}
        else:
            years = age_days // 365
            return {"score": 5, "status": "safe", "details": f"Domain is {years} year(s) old — established domain.", "age_days": age_days}
    except Exception as e:
        return {"score": 40, "status": "warning", "details": f"WHOIS lookup failed: {str(e)}", "age_days": None}