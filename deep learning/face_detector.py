"""
face_detector.py — Face Detection using OpenCV DNN
====================================================
Uses the OpenCV DNN SSD face detector (Caffe) to locate
faces within a given image region (typically a person crop).
"""

from typing import List, Tuple

import cv2
import numpy as np


def detect_faces(
    frame: np.ndarray,
    face_net,
    confidence_threshold: float = 0.5,
) -> List[Tuple[int, int, int, int]]:
    """
    Detect faces in *frame* using the OpenCV DNN SSD face detector.

    Parameters
    ----------
    frame : np.ndarray
        BGR image (or person ROI crop).
    face_net : cv2.dnn.Net
        Loaded face detection network.
    confidence_threshold : float
        Minimum confidence to keep a face detection.

    Returns
    -------
    faces : list of (x1, y1, x2, y2)
        Bounding boxes of detected faces in pixel coordinates.
    """
    if face_net is None or frame is None or frame.size == 0:
        return []

    h, w = frame.shape[:2]

    # The SSD face detector expects a 300×300 input blob
    blob = cv2.dnn.blobFromImage(
        frame, scalefactor=1.0, size=(300, 300),
        mean=(104.0, 177.0, 123.0), swapRB=False, crop=False,
    )
    face_net.setInput(blob)
    detections = face_net.forward()

    faces = []
    for i in range(detections.shape[2]):
        conf = float(detections[0, 0, i, 2])
        if conf < confidence_threshold:
            continue

        # Scale bounding box back to original frame size
        x1 = max(0, int(detections[0, 0, i, 3] * w))
        y1 = max(0, int(detections[0, 0, i, 4] * h))
        x2 = min(w, int(detections[0, 0, i, 5] * w))
        y2 = min(h, int(detections[0, 0, i, 6] * h))

        # Sanity check
        if x2 > x1 and y2 > y1:
            faces.append((x1, y1, x2, y2))

    return faces
