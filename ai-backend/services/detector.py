from PIL import Image
import io
import torch
#from services.face_detector import detect_face
from services.deepfake_model import model, processor
from services.face_detector import detect_face
from services.gradcam import generate_gradcam_advanced



async def detect_deepfake(file):
    contents = await file.read()

    image = Image.open(io.BytesIO(contents)).convert("RGB")
    face_data = detect_face(image)

    inputs = processor(images=image, return_tensors="pt")

    with torch.no_grad():
        outputs = model(**inputs)

    prediction = torch.softmax(outputs.logits, dim=1)

    fake_prob = float(prediction[0][0])
    real_prob = float(prediction[0][1])

    authenticity_score = round(real_prob * 100)

    confidence_score = round(
        max(real_prob, fake_prob) * 100
    )

    if authenticity_score >= 70:
        risk_level = "low"
    elif authenticity_score >= 40:
        risk_level = "medium"
    else:
        risk_level = "high"

    print("REAL:", real_prob)
    print("FAKE:", fake_prob)

    # Generate Grad-CAM heatmap
    heatmap_result = generate_gradcam_advanced(image)
    
    if heatmap_result["heatmap_generated"]:
        print(f"Heatmap generated: {heatmap_result['heatmap_url']}")
    else:
        print("Heatmap generation failed")

    print(type(face_data["faces"]))
    print(face_data)

    print("HEATMAP RESULT:")
    print(heatmap_result)

    for k, v in heatmap_result.items():
        print(k, type(v))

    print(type(face_data["faces"]))
    print(type(face_data["boxes"]))
    print(face_data)
    
    return {
    "authenticity_score": int(authenticity_score),
    "confidence_score": int(confidence_score),
    "risk_level": str(risk_level),
    "fake_probability": float(fake_prob),
    "real_probability": float(real_prob),

    "face_found": bool(face_data["face_found"]),
    "faces_detected": int(face_data["faces"]),
    "face_boxes": face_data["boxes"],

    "heatmap_url": str(heatmap_result.get("heatmap_url", "")),
    "heatmap_generated": bool(
        heatmap_result.get("heatmap_generated", False)
    )
}