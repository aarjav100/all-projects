"""
utils.py — Utility Functions
==============================
FPS measurement, frame resizing, CSV report generation,
detection logging, alert checking, and AI insights.
"""

import csv
import io
import os
import time
from collections import Counter
from datetime import datetime
from typing import Dict, List, Tuple

import cv2
import numpy as np


# ──────────────────────────────────────────────
# FPS helpers
# ──────────────────────────────────────────────

def calculate_fps(prev_time: float) -> Tuple[float, float]:
    """Return ``(fps, current_time)``."""
    now = time.time()
    elapsed = now - prev_time
    fps = 1.0 / elapsed if elapsed > 0 else 0.0
    return round(fps, 1), now


# ──────────────────────────────────────────────
# Frame resizing
# ──────────────────────────────────────────────

def resize_frame(frame: np.ndarray, max_width: int = 640) -> np.ndarray:
    """Resize proportionally so that width ≤ max_width."""
    h, w = frame.shape[:2]
    if w <= max_width:
        return frame
    scale = max_width / w
    return cv2.resize(frame, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)


# ──────────────────────────────────────────────
# AI Insights (rule-based)
# ──────────────────────────────────────────────

def generate_insights(analytics: dict) -> List[str]:
    """Generate human-readable insights from analytics dict."""
    insights = []
    total = analytics.get("total_objects", 0)
    persons = analytics.get("person_count", 0)
    males = analytics.get("male_count", 0)
    females = analytics.get("female_count", 0)
    obj_counts = analytics.get("object_counts", {})

    if total == 0:
        insights.append("🔍 No objects detected. Try lowering the confidence threshold.")
        return insights

    # Crowd insights
    if persons >= 15:
        insights.append("🚨 **Very high crowd density** — potential safety concern")
    elif persons >= 8:
        insights.append("⚠️ **High crowd density** detected")
    elif persons >= 3:
        insights.append(f"👥 **Moderate crowd** — {persons} people in scene")

    # Gender insights
    if males + females > 0:
        total_gender = males + females
        male_pct = males / total_gender * 100 if total_gender else 0
        female_pct = females / total_gender * 100 if total_gender else 0
        insights.append(
            f"👤 Gender split: **{males} Male** ({male_pct:.0f}%) / "
            f"**{females} Female** ({female_pct:.0f}%)"
        )

        if males > 0 and females == 0:
            insights.append("🔵 All detected faces are **Male**")
        elif females > 0 and males == 0:
            insights.append("🟣 All detected faces are **Female**")

    # Vehicle insights
    vehicle_classes = {"car", "truck", "bus", "motorcycle", "bicycle"}
    vehicle_count = sum(obj_counts.get(v, 0) for v in vehicle_classes)
    if vehicle_count >= 5:
        insights.append(f"🚗 **Heavy traffic** — {vehicle_count} vehicles detected")
    elif vehicle_count >= 2:
        insights.append(f"🛣️ {vehicle_count} vehicle(s) in the scene")

    # Diversity
    if len(obj_counts) >= 5:
        insights.append(f"🌈 **Diverse scene** — {len(obj_counts)} object types")

    # High density
    if total >= 20:
        insights.append(f"📊 Very busy scene — **{total}** total objects")

    return insights


# ──────────────────────────────────────────────
# Alert checking
# ──────────────────────────────────────────────

def check_alerts(analytics: dict, person_threshold: int = 10) -> List[str]:
    """Return list of alert messages based on thresholds."""
    alerts = []
    persons = analytics.get("person_count", 0)

    if persons > person_threshold:
        alerts.append(
            f"🚨 Person count ({persons}) exceeds threshold ({person_threshold})!"
        )

    return alerts


# ──────────────────────────────────────────────
# Detection logging (CSV)
# ──────────────────────────────────────────────

LOG_DIR = "detection_logs"


def save_detection_log(
    analytics: dict,
    fps: float = 0.0,
    source: str = "image",
    log_file: str = "detections.csv",
) -> str:
    """Append a detection row to CSV log. Returns file path."""
    os.makedirs(LOG_DIR, exist_ok=True)
    path = os.path.join(LOG_DIR, log_file)
    file_exists = os.path.isfile(path)

    with open(path, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow([
                "timestamp", "source", "fps", "total_objects",
                "persons", "males", "females", "objects",
            ])
        writer.writerow([
            datetime.now().isoformat(),
            source,
            fps,
            analytics.get("total_objects", 0),
            analytics.get("person_count", 0),
            analytics.get("male_count", 0),
            analytics.get("female_count", 0),
            str(analytics.get("object_counts", {})),
        ])
    return path


# ──────────────────────────────────────────────
# CSV report generation
# ──────────────────────────────────────────────

def generate_csv_report(history: List[dict]) -> bytes:
    """Convert detection history to downloadable CSV bytes."""
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Timestamp", "Source", "FPS", "Total Objects",
        "Persons", "Males", "Females", "Object Details",
    ])
    for entry in history:
        writer.writerow([
            entry.get("timestamp", ""),
            entry.get("source", ""),
            entry.get("fps", 0),
            entry.get("total", 0),
            entry.get("persons", 0),
            entry.get("males", 0),
            entry.get("females", 0),
            str(entry.get("objects", {})),
        ])
    return output.getvalue().encode("utf-8")
