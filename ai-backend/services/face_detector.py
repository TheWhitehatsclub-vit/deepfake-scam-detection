import cv2
import numpy as np

def detect_face(image):
    img = np.array(image)
    gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)

    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )

    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.2,
        minNeighbors=8,
        minSize=(80, 80)
    )

    boxes = []

    for (x, y, w, h) in faces:
        boxes.append([
            int(x),
            int(y),
            int(w),
            int(h)
        ])

    return {
        "face_found": bool(len(faces) > 0),
        "faces": int(len(faces)),
        "boxes": boxes
    }