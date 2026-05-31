"""
model_loader.py — Model Loading & Device Management
=====================================================
Loads YOLOv8, OpenCV DNN face detector, and Caffe gender
classifier. Provides device auto-detection and model caching.
"""

import os
import torch
import cv2
import streamlit as st
from ultralytics import YOLO


# ──────────────────────────────────────────────
# Paths
# ──────────────────────────────────────────────

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")


# ──────────────────────────────────────────────
# Device helpers
# ──────────────────────────────────────────────

def get_device() -> str:
    """Return 'cuda' if GPU available, else 'cpu'."""
    return "cuda" if torch.cuda.is_available() else "cpu"


def get_device_info() -> dict:
    """Return device name, type, and memory info."""
    device = get_device()
    info = {"device": device, "name": "CPU"}
    if device == "cuda":
        info["name"] = torch.cuda.get_device_name(0)
        info["memory_total"] = f"{torch.cuda.get_device_properties(0).total_mem / 1e9:.1f} GB"
    return info


# ──────────────────────────────────────────────
# YOLOv8 model
# ──────────────────────────────────────────────

AVAILABLE_MODELS = {
    "YOLOv8 Nano  (fastest)": "yolov8n.pt",
    "YOLOv8 Small (balanced)": "yolov8s.pt",
    "YOLOv8 Medium (accurate)": "yolov8m.pt",
}


def get_available_models() -> dict:
    return AVAILABLE_MODELS


@st.cache_resource(show_spinner="Loading YOLO model …")
def load_yolo(weight_file: str = "yolov8n.pt") -> YOLO:
    """Load a YOLOv8 model with pretrained COCO weights."""
    try:
        model = YOLO(weight_file)
        return model
    except Exception as e:
        st.error(f"❌ Failed to load YOLO model: {e}")
        raise


# ──────────────────────────────────────────────
# Face detector (OpenCV DNN SSD)
# ──────────────────────────────────────────────

@st.cache_resource(show_spinner="Loading face detection model …")
def load_face_detector():
    """
    Load the OpenCV DNN SSD face detector (Caffe).
    Returns a ``cv2.dnn.Net`` or None if files are missing.
    """
    prototxt = os.path.join(MODELS_DIR, "deploy.prototxt")
    caffemodel = os.path.join(MODELS_DIR, "res10_300x300_ssd_iter_140000.caffemodel")

    if not os.path.isfile(prototxt) or not os.path.isfile(caffemodel):
        st.warning(
            "⚠️ Face detection model not found. "
            "Run `python download_models.py` first."
        )
        return None

    try:
        net = cv2.dnn.readNetFromCaffe(prototxt, caffemodel)
        return net
    except Exception as e:
        st.error(f"❌ Failed to load face detector: {e}")
        return None


# ──────────────────────────────────────────────
# Gender classifier (Caffe)
# ──────────────────────────────────────────────

@st.cache_resource(show_spinner="Loading gender classification model …")
def load_gender_classifier():
    """
    Load the Levi-Hassner gender classification model (Caffe).
    Returns a ``cv2.dnn.Net`` or None if files are missing.
    """
    prototxt = os.path.join(MODELS_DIR, "gender_deploy.prototxt")
    caffemodel = os.path.join(MODELS_DIR, "gender_net.caffemodel")

    if not os.path.isfile(prototxt) or not os.path.isfile(caffemodel):
        st.warning(
            "⚠️ Gender classification model not found. "
            "Run `python download_models.py` first."
        )
        return None

    try:
        net = cv2.dnn.readNetFromCaffe(prototxt, caffemodel)
        return net
    except Exception as e:
        st.error(f"❌ Failed to load gender classifier: {e}")
        return None


# ──────────────────────────────────────────────
# COCO class names (for filtering)
# ──────────────────────────────────────────────

COCO_CLASSES = [
    "person", "bicycle", "car", "motorcycle", "airplane", "bus", "train",
    "truck", "boat", "traffic light", "fire hydrant", "stop sign",
    "parking meter", "bench", "bird", "cat", "dog", "horse", "sheep",
    "cow", "elephant", "bear", "zebra", "giraffe", "backpack", "umbrella",
    "handbag", "tie", "suitcase", "frisbee", "skis", "snowboard",
    "sports ball", "kite", "baseball bat", "baseball glove", "skateboard",
    "surfboard", "tennis racket", "bottle", "wine glass", "cup", "fork",
    "knife", "spoon", "bowl", "banana", "apple", "sandwich", "orange",
    "broccoli", "carrot", "hot dog", "pizza", "donut", "cake", "chair",
    "couch", "potted plant", "bed", "dining table", "toilet", "tv",
    "laptop", "mouse", "remote", "keyboard", "cell phone", "microwave",
    "oven", "toaster", "sink", "refrigerator", "book", "clock", "vase",
    "scissors", "teddy bear", "hair drier", "toothbrush",
]


def get_coco_classes() -> list:
    return COCO_CLASSES.copy()
