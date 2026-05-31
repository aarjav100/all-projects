"""
gender_classifier.py — Gender Classification using Caffe Model
================================================================
Classifies a face crop as Male or Female using the Levi-Hassner
pretrained gender classification model loaded via OpenCV DNN.
"""

from typing import Tuple

import cv2
import numpy as np

# Model output labels (must match the training order)
GENDER_LABELS = ["Male", "Female"]

# Input blob mean values (from the original training)
MODEL_MEAN = (78.4263377603, 87.7689143744, 114.895847746)


def classify_gender(
    face_crop: np.ndarray,
    gender_net,
) -> Tuple[str, float]:
    """
    Classify the gender of a face crop.

    Parameters
    ----------
    face_crop : np.ndarray
        BGR image of a cropped face region.
    gender_net : cv2.dnn.Net
        Loaded Caffe gender classification network.

    Returns
    -------
    (label, confidence) : (str, float)
        ``label`` is "Male" or "Female".
        ``confidence`` is in [0, 1].
    """
    if gender_net is None or face_crop is None or face_crop.size == 0:
        return "Unknown", 0.0

    try:
        # The gender model expects a 227×227 blob
        blob = cv2.dnn.blobFromImage(
            face_crop, scalefactor=1.0, size=(227, 227),
            mean=MODEL_MEAN, swapRB=False, crop=False,
        )
        gender_net.setInput(blob)
        preds = gender_net.forward()

        # preds shape: (1, 2) — [Male_prob, Female_prob]
        idx = int(preds[0].argmax())
        label = GENDER_LABELS[idx]
        confidence = float(preds[0][idx])

        return label, confidence

    except Exception:
        return "Unknown", 0.0
