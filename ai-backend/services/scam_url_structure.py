import re
from urllib.parse import urlparse
import tldextract

SUSPICIOUS_TLDS = {".tk", ".ml", ".ga", ".cf", ".gq", ".xyz", ".top", ".click", ".work", ".loan"}

def check_url_structure(url: str) -> dict:
    flags = []
    score = 0
    parsed = urlparse(url)
    extracted = tldextract.extract(url)
    domain = parsed.netloc.lower()

    # IP address instead of domain
    if re.match(r"^\d{1,3}(\.\d{1,3}){3}$", domain):
        flags.append("Uses raw IP address instead of domain name")
        score += 40

    # @ symbol in URL (redirects to different host)
    if "@" in url:
        flags.append("Contains @ symbol — actual destination may be different")
        score += 35

    # excessive subdomains (more than 3 levels)
    subdomain_count = len(extracted.subdomain.split(".")) if extracted.subdomain else 0
    if subdomain_count > 2:
        flags.append(f"Excessive subdomains ({subdomain_count} levels)")
        score += 20

    # suspicious TLD
    tld = f".{extracted.suffix}" if extracted.suffix else ""
    if tld in SUSPICIOUS_TLDS:
        flags.append(f"High-risk TLD: {tld}")
        score += 30

    # excessive hyphens in domain
    if extracted.domain.count("-") > 2:
        flags.append("Excessive hyphens in domain name")
        score += 15

    # very long URL
    if len(url) > 100:
        flags.append(f"Unusually long URL ({len(url)} chars)")
        score += 10

    # encoded characters (obfuscation)
    if re.search(r"%[0-9a-fA-F]{2}", url):
        flags.append("Contains percent-encoded characters — possible obfuscation")
        score += 20

    # HTTP (not HTTPS)
    if parsed.scheme == "http":
        flags.append("Uses HTTP, not HTTPS — no encryption")
        score += 25

    score = min(score, 100)
    if score == 0:
        return {"score": 0, "status": "safe", "details": "URL structure looks normal.", "flags": []}
    elif score < 40:
        return {"score": score, "status": "warning", "details": " | ".join(flags), "flags": flags}
    else:
        return {"score": score, "status": "danger", "details": " | ".join(flags), "flags": flags}