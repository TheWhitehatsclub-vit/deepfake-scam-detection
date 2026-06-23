import easyocr
import cv2
import numpy as np

reader = easyocr.Reader(['en'])

def extract_text(image_bytes):
    nparr = np.frombuffer(image_bytes, np.uint8)

    image = cv2.imdecode(
        nparr,
        cv2.IMREAD_COLOR
    )

    result = reader.readtext(
        image,
        detail=0
    )

    return " ".join(result)