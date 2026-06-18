from fastapi import FastAPI, UploadFile, File
from fastapi.staticfiles import StaticFiles
from services.model_loader import load_model
from services.detector import detect_deepfake
from services.screenshot_analyzer import analyze_screenshot
import os

app = FastAPI()

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