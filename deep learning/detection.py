"""
detection.py — Full Detection Pipeline
========================================
Orchestrates: YOLOv8 object detection → person ROI extraction →
face detection → gender classification.  Returns an annotated
frame and a comprehensive analytics dictionary.
"""

from typing import Dict, List, Optional, Set, Tuple

import cv2
import numpy as np

from face_detector import detect_faces
from gender_classifier import classify_gender


# ──────────────────────────────────────────────
# Color palette
# ──────────────────────────────────────────────

_PALETTE = [
    (255,  56,  56), (255, 157,  56), (255, 255,  56), ( 56, 255,  56),
    ( 56, 255, 255), ( 56,  56, 255), (255,  56, 255), (200, 130,  80),
    (130, 200,  80), ( 80, 130, 200), (200,  80, 130), ( 80, 200, 130),
    (255, 190, 100), (100, 255, 190), (190, 100, 255), (255, 100, 190),
    (100, 190, 255), (190, 255, 100), (210, 210, 210), (160, 120, 200),
]

# Special colors for gender labels
COLOR_MALE   = (248, 189, 56)   # Cyan-ish (BGR)
COLOR_FEMALE = (180, 105, 255)  # Pink (BGR)
COLOR_PERSON = (56, 255, 56)    # Green
COLOR_FACE   = (255, 200, 50)   # Light blue


def _color_for(cls_id: int) -> Tuple[int, int, int]:
    return _PALETTE[cls_id % len(_PALETTE)]


# ──────────────────────────────────────────────
# Full pipeline
# ──────────────────────────────────────────────

def run_full_pipeline(
    frame: np.ndarray,
    yolo_model,
    face_net,
    gender_net,
    confidence: float = 0.35,
    device: str = "cpu",
    gender_enabled: bool = True,
    face_conf: float = 0.5,
) -> Tuple[np.ndarray, dict]:
    """
    Run the complete detection pipeline on a single frame.

    Parameters
    ----------
    frame : np.ndarray
        BGR input image.
    yolo_model : YOLO
        Loaded YOLOv8 model.
    face_net : cv2.dnn.Net or None
        Face detection network.
    gender_net : cv2.dnn.Net or None
        Gender classification network.
    confidence : float
        YOLO confidence threshold.
    device : str
        'cuda' or 'cpu'.
    gender_enabled : bool
        Whether to run the face+gender pipeline on persons.
    face_conf : float
        Face detection confidence threshold.

    Returns
    -------
    annotated : np.ndarray
        Frame with all bounding boxes and labels drawn.
    analytics : dict
        Keys: total_objects, person_count, male_count, female_count,
              object_counts (dict), gender_details (list), detections (list).
    """
    annotated = frame.copy()

    # Analytics accumulators
    object_counts: Dict[str, int] = {}
    gender_details: List[dict] = []
    detections: List[dict] = []
    person_count = 0
    male_count = 0
    female_count = 0
    total = 0

    # ── Step 1: YOLO object detection ──────────
    results = yolo_model.predict(frame, conf=confidence, device=device, verbose=False)

    if results and len(results) > 0:
        result = results[0]
        boxes = result.boxes

        if boxes is not None and len(boxes) > 0:
            for box in boxes:
                conf_val = float(box.conf[0])
                if conf_val < confidence:
                    continue

                cls_id = int(box.cls[0])
                cls_name = result.names[cls_id]
                x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
                total += 1

                # Count objects
                object_counts[cls_name] = object_counts.get(cls_name, 0) + 1

                detection_entry = {
                    "class": cls_name,
                    "confidence": conf_val,
                    "bbox": (x1, y1, x2, y2),
                    "gender": None,
                    "gender_conf": None,
                }

                # ── Step 2: Person → Face → Gender ──────
                if cls_name == "person":
                    person_count += 1
                    color = COLOR_PERSON

                    if gender_enabled and face_net is not None and gender_net is not None:
                        # Extract person ROI
                        h, w = frame.shape[:2]
                        px1, py1 = max(0, x1), max(0, y1)
                        px2, py2 = min(w, x2), min(h, y2)
                        person_roi = frame[py1:py2, px1:px2]

                        if person_roi.size > 0:
                            # Detect faces inside person ROI
                            faces = detect_faces(person_roi, face_net, face_conf)

                            for (fx1, fy1, fx2, fy2) in faces:
                                face_crop = person_roi[fy1:fy2, fx1:fx2]

                                if face_crop.size > 0:
                                    gender_label, gender_conf = classify_gender(
                                        face_crop, gender_net,
                                    )

                                    if gender_label == "Male":
                                        male_count += 1
                                        g_color = COLOR_MALE
                                    elif gender_label == "Female":
                                        female_count += 1
                                        g_color = COLOR_FEMALE
                                    else:
                                        g_color = (180, 180, 180)

                                    detection_entry["gender"] = gender_label
                                    detection_entry["gender_conf"] = gender_conf

                                    gender_details.append({
                                        "gender": gender_label,
                                        "confidence": gender_conf,
                                    })

                                    # Draw face box (relative to full frame)
                                    abs_fx1 = px1 + fx1
                                    abs_fy1 = py1 + fy1
                                    abs_fx2 = px1 + fx2
                                    abs_fy2 = py1 + fy2

                                    cv2.rectangle(
                                        annotated,
                                        (abs_fx1, abs_fy1),
                                        (abs_fx2, abs_fy2),
                                        g_color, 2,
                                    )

                                    # Gender label
                                    g_label = f"{gender_label} {gender_conf:.0%}"
                                    (tw, th), _ = cv2.getTextSize(
                                        g_label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1,
                                    )
                                    cv2.rectangle(
                                        annotated,
                                        (abs_fx1, abs_fy1 - th - 8),
                                        (abs_fx1 + tw + 4, abs_fy1),
                                        g_color, -1,
                                    )
                                    cv2.putText(
                                        annotated, g_label,
                                        (abs_fx1 + 2, abs_fy1 - 4),
                                        cv2.FONT_HERSHEY_SIMPLEX, 0.5,
                                        (0, 0, 0), 1, cv2.LINE_AA,
                                    )

                                    # Update person box color to match gender
                                    color = g_color

                else:
                    color = _color_for(cls_id)

                # ── Draw object bounding box ────────────
                cv2.rectangle(annotated, (x1, y1), (x2, y2), color, 2)

                # Object label
                obj_label = f"{cls_name} {conf_val:.0%}"
                (tw, th), _ = cv2.getTextSize(
                    obj_label, cv2.FONT_HERSHEY_SIMPLEX, 0.55, 1,
                )
                cv2.rectangle(
                    annotated, (x1, y1 - th - 10),
                    (x1 + tw + 6, y1), color, -1,
                )
                cv2.putText(
                    annotated, obj_label, (x1 + 3, y1 - 5),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.55,
                    (255, 255, 255), 1, cv2.LINE_AA,
                )

                detections.append(detection_entry)

    analytics = {
        "total_objects": total,
        "person_count": person_count,
        "male_count": male_count,
        "female_count": female_count,
        "object_counts": object_counts,
        "gender_details": gender_details,
        "detections": detections,
    }

    return annotated, analytics
