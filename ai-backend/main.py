from fastapi import FastAPI, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from services.model_loader import load_model
from services.detector import detect_deepfake
from services.screenshot_analyzer import analyze_screenshot
from pydantic import BaseModel
import tldextract
import os

# your scam website service imports
from services.scam_domain_age import check_domain_age
from services.scam_ssl import check_ssl
from services.scam_url_structure import check_url_structure
from services.scam_brand_similarity import check_brand_similarity
from services.scam_keywords import check_keywords
from services.scam_reputation import check_reputation
from services.scam_scorer import calculate_trust_score
from services.scam_content import check_content
from services.scam_explainer import generate_explanation

import socket

def domain_resolves(domain: str) -> bool:
    try:
        socket.gethostbyname(domain)
        return True
    except socket.gaierror:
        return False

app = FastAPI()

# CORS — allows your Next.js frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static directory for heatmaps
heatmap_dir = "uploads/heatmaps"
if not os.path.exists(heatmap_dir):
    os.makedirs(heatmap_dir, exist_ok=True)

app.mount("/heatmaps", StaticFiles(directory=heatmap_dir), name="heatmaps")

@app.get("/")
def home():
    model = load_model()
    return {
        "status": "running",
        "model_loaded": True
    }

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    result = await detect_deepfake(file)
    return result

@app.post("/analyze-screenshot")
async def analyze_screenshot_endpoint(file: UploadFile = File(...)):
    result = await analyze_screenshot(file)
    return result


# ── Scam Website Detection ──────────────────────────────────────────

class ScamCheckRequest(BaseModel):
    url: str

@app.post("/api/scam-website/check")
async def check_scam_website(request: ScamCheckRequest):
    url = request.url
    if not url.startswith("http"):
        url = "https://" + url

    extracted = tldextract.extract(url)
    domain = f"{extracted.domain}.{extracted.suffix}"

    # NEW: hard check — does this domain even exist on the internet?
    if not domain_resolves(domain):
        return {
            "url": url,
            "domain": domain,
            "trust_score": 5,
            "overall_status": "danger",
            "explanation": f"The domain '{domain}' does not resolve to any active website. This could mean the site doesn't exist, has been taken down, or the URL was never valid. Non-existent or unreachable domains are a strong indicator of scam links, expired phishing campaigns, or fake URLs.",
            "checks": {
                "domain_age": {"score": 100, "status": "danger", "details": "Domain does not resolve — does not exist or is unreachable.", "age_days": None},
                "ssl_certificate": {"score": 100, "status": "danger", "details": "Cannot verify SSL — domain unreachable.", "issuer": None, "days_remaining": None},
                "url_structure": check_url_structure(url),
                "brand_similarity": check_brand_similarity(url),
                "suspicious_keywords": check_keywords(url),
                "reputation": {"score": 50, "status": "warning", "details": "Could not check reputation — domain unreachable.", "details": "Domain unreachable, reputation check skipped."},
                "content_analysis": {"score": 100, "status": "danger", "details": "Cannot analyze content — domain unreachable.", "flags": ["Domain does not resolve"]},
            },
        }

    checks = {
        "domain_age":          check_domain_age(domain),
        "ssl_certificate":     check_ssl(domain),
        "url_structure":       check_url_structure(url),
        "brand_similarity":    check_brand_similarity(url),
        "suspicious_keywords": check_keywords(url),
        "reputation":          await check_reputation(url),
        "content_analysis":    await check_content(url),
    }

    scoring = calculate_trust_score(checks)
    explanation = generate_explanation(url, checks, scoring["trust_score"], scoring["overall_status"])

    return {
        "url": url,
        "domain": domain,
        "trust_score": scoring["trust_score"],
        "overall_status": scoring["overall_status"],
        "explanation": explanation,
        "checks": checks,
    }