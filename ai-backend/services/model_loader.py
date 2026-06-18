import torch
import timm

MODEL = None

def load_model():
    global MODEL

    if MODEL is None:
        MODEL = timm.create_model(
            "efficientnet_b0",
            pretrained=True,
            num_classes=2
        )

        MODEL.eval()

    return MODEL