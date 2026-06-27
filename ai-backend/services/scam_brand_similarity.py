from rapidfuzz import fuzz
import tldextract
from urllib.parse import urlparse

KNOWN_BRANDS = [
    "google", "facebook", "paypal", "amazon", "apple", "microsoft", "netflix",
    "instagram", "twitter", "whatsapp", "linkedin", "youtube", "gmail",
    "sbi", "hdfc", "icici", "axisbank", "paytm", "phonepe", "gpay",
    "flipkart", "myntra", "swiggy", "zomato", "ola", "uber",
    "irctc", "uidai", "incometax", "epfo",
    "wellsfargo", "chase", "bankofamerica", "citibank",
]

def check_brand_similarity(url: str) -> dict:
    extracted = tldextract.extract(url)
    domain_name = extracted.domain.lower()
    full_hostname = urlparse(url if url.startswith("http") else f"http://{url}").netloc.lower()

    # exact match on registrable domain is fine
    if domain_name in KNOWN_BRANDS:
        return {"score": 0, "status": "safe", "details": "Domain matches a known legitimate brand.", "matched_brand": domain_name, "similarity": 100}

    # NEW: check if a brand name appears elsewhere in the hostname (subdomain trick)
    for brand in KNOWN_BRANDS:
        if brand in full_hostname and domain_name != brand:
            return {
                "score": 85,
                "status": "danger",
                "details": f"Brand name '{brand}' appears in subdomain but actual domain is '{domain_name}' — classic phishing technique.",
                "matched_brand": brand,
                "similarity": 100,
            }

    # existing fuzzy match logic on registrable domain
    best_score = 0
    best_match = None
    for brand in KNOWN_BRANDS:
        similarity = fuzz.ratio(domain_name, brand)
        if similarity > best_score:
            best_score = similarity
            best_match = brand

    if best_score >= 80:
        return {"score": 80, "status": "danger", "details": f"Domain '{domain_name}' is very similar to '{best_match}' — likely typosquatting.", "matched_brand": best_match, "similarity": best_score}
    elif best_score >= 60:
        return {"score": 50, "status": "warning", "details": f"Domain '{domain_name}' resembles '{best_match}' — possible impersonation.", "matched_brand": best_match, "similarity": best_score}
    else:
        return {"score": 0, "status": "safe", "details": "No significant brand similarity detected.", "matched_brand": None, "similarity": best_score}