from fastapi import FastAPI, UploadFile, File, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
import tldextract
import os

# Database imports
from database import Base, engine, get_db
from models.report import Report
from fastapi.responses import FileResponse
from services.pdf_service import generate_pdf
# Deepfake imports
from services.model_loader import load_model
from services.detector import detect_deepfake

# Screenshot analysis imports
from services.screenshot_analyzer import analyze_screenshot
from services.ocr_service import extract_text
from services.classifier import classify_screenshot
from services.scam_detector import detect_scam
from services.gemini_service import generate_explanation

# Scam website imports
from services.scam_domain_age import check_domain_age
from services.scam_ssl import check_ssl
from services.scam_url_structure import check_url_structure
from services.scam_brand_similarity import check_brand_similarity
from services.scam_keywords import check_keywords
from services.scam_reputation import check_reputation
from services.scam_scorer import calculate_trust_score

# -------------------------------------------------
# Create FastAPI app
# -------------------------------------------------
app = FastAPI()

# Create database tables
Base.metadata.create_all(bind=engine)

# -------------------------------------------------
# CORS
# -------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------
# Upload folders
# -------------------------------------------------
os.makedirs("uploads", exist_ok=True)

heatmap_dir = "uploads/heatmaps"
os.makedirs(heatmap_dir, exist_ok=True)

app.mount(
    "/heatmaps",
    StaticFiles(directory=heatmap_dir),
    name="heatmaps"
)

# -------------------------------------------------
# Home Route
# -------------------------------------------------
@app.get("/")
def home():
    load_model()

    return {
        "status": "running",
        "model_loaded": True
    }

# -------------------------------------------------
# Deepfake Detection
# -------------------------------------------------
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    result = await detect_deepfake(file)
    return result

# -------------------------------------------------
# Existing Screenshot Analyzer
# -------------------------------------------------
@app.post("/analyze-screenshot")
async def analyze_screenshot_endpoint(
    file: UploadFile = File(...)
):
    result = await analyze_screenshot(file)
    return result

# -------------------------------------------------
# Real-Time Screenshot Analysis
# -------------------------------------------------
@app.post("/analyze")
async def analyze(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Read uploaded image
    image = await file.read()

    # Save image
    file_path = f"uploads/{file.filename}"

    with open(file_path, "wb") as f:
        f.write(image)

    # OCR
    extracted_text = extract_text(image)
    print("\n========== OCR TEXT ==========")
    print(extracted_text)
    print("================================\n")

    # Classification
    screenshot_type = classify_screenshot(
        extracted_text
    )

    # Scam analysis
    analysis = detect_scam(
        extracted_text
    )
    print("ANALYSIS:")
    print(analysis)
    scam_probability = analysis.get(
        "scam_probability",
        0
    )

    tactics = analysis.get(
        "tactics",
        []
    )

    urls_found = analysis.get(
        "urls_found",
        0
    )

    trust_score = 100 - scam_probability
    if scam_probability >= 80:
        risk_level = "Very High Risk"

    elif scam_probability >= 60:
        risk_level = "High Risk"

    elif scam_probability >= 30:
        risk_level = "Medium Risk"

    else:
        risk_level = "Low Risk"

    recommendations = []

    if scam_probability >= 60:
        recommendations.append(
            "Do not click suspicious links."
        )

        recommendations.append(
            "Do not share personal information."
        )

        recommendations.append(
            "Verify through official websites."
        )

    else:
        recommendations.append(
            "No major scam indicators detected."
        )

    # Gemini explanation
    explanation = generate_explanation(
        extracted_text,
        analysis
    )

    # Save report
    report = Report(
        filename=file.filename,
        extracted_text=extracted_text,
        screenshot_type=screenshot_type,
        scam_probability=scam_probability,
        risk_level=risk_level,
        tactics=tactics,
        urls_found=urls_found,
        trust_score=trust_score,
        explanation=str(explanation),
        recommendations=recommendations
    )

    db.add(report)
    db.commit()
    db.refresh(report)

    # Return response
    return {
    "success": True,
    "fileName": file.filename,
    "fileType": file.content_type,
    "scam_score": scam_probability,
    "risk_level": (
        "high" if scam_probability >= 70
        else "medium" if scam_probability >= 40
        else "low"
    ),
    "findings": [
        {
            "category": tactic,
            "description": tactic,
            "severity": "high"
        }
        for tactic in tactics
    ],
    "recommendations": recommendations,
    "extracted_text": extracted_text
}

# -------------------------------------------------
# Scam Website Detection
# -------------------------------------------------
class ScamCheckRequest(BaseModel):
    url: str


@app.post("/api/scam-website/check")
async def check_scam_website(
    request: ScamCheckRequest
):
    url = request.url

    if not url.startswith(
        ("http://", "https://")
    ):
        url = "https://" + url

    extracted = tldextract.extract(url)

    domain = (
        f"{extracted.domain}."
        f"{extracted.suffix}"
    )

    checks = {
        "domain_age":
            check_domain_age(domain),

        "ssl_certificate":
            check_ssl(domain),

        "url_structure":
            check_url_structure(url),

        "brand_similarity":
            check_brand_similarity(url),

        "suspicious_keywords":
            check_keywords(url),

        "reputation":
            await check_reputation(url),
    }

    scoring = calculate_trust_score(checks)

    return {
        "url": url,
        "domain": domain,
        "trust_score":
            scoring["trust_score"],
        "overall_status":
            scoring["overall_status"],
        "checks": checks,
    }
@app.get("/reports")
def get_reports(
    db: Session = Depends(get_db)
):
    reports = db.query(
        Report
    ).all()

    return reports
@app.get("/report/{report_id}")
def get_report(
    report_id: int,
    db: Session = Depends(get_db)
):
    report = (
        db.query(Report)
        .filter(
            Report.id == report_id
        )
        .first()
    )

    if not report:
        return {
            "message":
            "Report not found"
        }

    return report
@app.get("/download-report/{report_id}")
def download_report(
    report_id: int,
    db: Session = Depends(get_db)
):
    report = (
        db.query(Report)
        .filter(
            Report.id == report_id
        )
        .first()
    )

    if not report:
        return {
            "message":
            "Report not found"
        }

    pdf_path = (
        f"reports/report_"
        f"{report_id}.pdf"
    )

    generate_pdf(
        report,
        pdf_path
    )

    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename=f"report_{report_id}.pdf"
    )