from transformers import AutoImageProcessor, AutoModelForImageClassification

MODEL_NAME = "prithivMLmods/Deep-Fake-Detector-Model"

processor = AutoImageProcessor.from_pretrained(MODEL_NAME)
model = AutoModelForImageClassification.from_pretrained(MODEL_NAME)
print(model.config.id2label)