"""
download_models.py — Auto-download pretrained face & gender models
====================================================================
Downloads OpenCV DNN face detection (Caffe SSD) and Levi-Hassner
gender classification models into the ``models/`` directory.

Usage::

    python download_models.py
"""

import os
import urllib.request
import sys

MODELS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models")

# ── URLs for pretrained models ──────────────────────
FILES = {
    # Face detection — OpenCV DNN SSD (Caffe)
    "deploy.prototxt": (
        "https://raw.githubusercontent.com/opencv/opencv/4.x/samples/dnn/face_detector/deploy.prototxt"
    ),
    "res10_300x300_ssd_iter_140000.caffemodel": (
        "https://github.com/opencv/opencv_3rdparty/raw/"
        "dnn_samples_face_detector_20170830/"
        "res10_300x300_ssd_iter_140000.caffemodel"
    ),
    # Gender classification — Levi & Hassner (GilLevi hosted on Google Drive)
    "gender_deploy.prototxt": (
        "https://raw.githubusercontent.com/eveningglow/age-and-gender-classification/"
        "master/gender_deploy.prototxt"
    ),
    "gender_net.caffemodel": (
        "https://github.com/eveningglow/age-and-gender-classification/"
        "raw/master/gender_net.caffemodel"
    ),
}

# Backup/fallback URLs in case primary fails
FALLBACK_URLS = {
    "deploy.prototxt": (
        "https://raw.githubusercontent.com/sr6033/face-detection-with-OpenCV-and-DNN/"
        "master/deploy.prototxt.txt"
    ),
    "res10_300x300_ssd_iter_140000.caffemodel": (
        "https://github.com/sr6033/face-detection-with-OpenCV-and-DNN/"
        "raw/master/res10_300x300_ssd_iter_140000_fp16.caffemodel"
    ),
    "gender_deploy.prototxt": None,
    "gender_net.caffemodel": None,
}


def download_file(url: str, dest: str) -> bool:
    """Download *url* to *dest*. Returns True on success."""
    if os.path.isfile(dest):
        size_mb = os.path.getsize(dest) / 1e6
        print(f"  ✔ Already exists: {os.path.basename(dest)} ({size_mb:.1f} MB)")
        return True

    print(f"  ⬇ Downloading: {os.path.basename(dest)} …", end=" ", flush=True)
    try:
        urllib.request.urlretrieve(url, dest)
        size_mb = os.path.getsize(dest) / 1e6
        print(f"done ({size_mb:.1f} MB)")
        return True
    except Exception as e:
        print(f"failed ({e})")
        if os.path.isfile(dest):
            os.remove(dest)
        return False


def create_gender_prototxt_manually(dest: str):
    """
    Write the gender_deploy.prototxt content directly.
    This is the standard Levi-Hassner architecture definition.
    """
    content = '''name: "CaffeNet"
input: "data"
input_dim: 1
input_dim: 3
input_dim: 227
input_dim: 227
layer {
  name: "conv1"
  type: "Convolution"
  bottom: "data"
  top: "conv1"
  convolution_param {
    num_output: 96
    kernel_size: 7
    stride: 4
  }
}
layer {
  name: "relu1"
  type: "ReLU"
  bottom: "conv1"
  top: "conv1"
}
layer {
  name: "pool1"
  type: "Pooling"
  bottom: "conv1"
  top: "pool1"
  pooling_param {
    pool: MAX
    kernel_size: 3
    stride: 2
    pad: 0
  }
}
layer {
  name: "norm1"
  type: "LRN"
  bottom: "pool1"
  top: "norm1"
  lrn_param {
    local_size: 5
    alpha: 0.0001
    beta: 0.75
  }
}
layer {
  name: "conv2"
  type: "Convolution"
  bottom: "norm1"
  top: "conv2"
  convolution_param {
    num_output: 256
    kernel_size: 5
    pad: 2
    stride: 1
  }
}
layer {
  name: "relu2"
  type: "ReLU"
  bottom: "conv2"
  top: "conv2"
}
layer {
  name: "pool2"
  type: "Pooling"
  bottom: "conv2"
  top: "pool2"
  pooling_param {
    pool: MAX
    kernel_size: 3
    stride: 2
    pad: 0
  }
}
layer {
  name: "norm2"
  type: "LRN"
  bottom: "pool2"
  top: "norm2"
  lrn_param {
    local_size: 5
    alpha: 0.0001
    beta: 0.75
  }
}
layer {
  name: "conv3"
  type: "Convolution"
  bottom: "norm2"
  top: "conv3"
  convolution_param {
    num_output: 384
    kernel_size: 3
    pad: 1
    stride: 1
  }
}
layer {
  name: "relu3"
  type: "ReLU"
  bottom: "conv3"
  top: "conv3"
}
layer {
  name: "pool5"
  type: "Pooling"
  bottom: "conv3"
  top: "pool5"
  pooling_param {
    pool: MAX
    kernel_size: 3
    stride: 2
    pad: 0
  }
}
layer {
  name: "fc6"
  type: "InnerProduct"
  bottom: "pool5"
  top: "fc6"
  inner_product_param {
    num_output: 512
  }
}
layer {
  name: "relu6"
  type: "ReLU"
  bottom: "fc6"
  top: "fc6"
}
layer {
  name: "drop6"
  type: "Dropout"
  bottom: "fc6"
  top: "fc6"
  dropout_param {
    dropout_ratio: 0.5
  }
}
layer {
  name: "fc7"
  type: "InnerProduct"
  bottom: "fc6"
  top: "fc7"
  inner_product_param {
    num_output: 512
  }
}
layer {
  name: "relu7"
  type: "ReLU"
  bottom: "fc7"
  top: "fc7"
}
layer {
  name: "drop7"
  type: "Dropout"
  bottom: "fc7"
  top: "fc7"
  dropout_param {
    dropout_ratio: 0.5
  }
}
layer {
  name: "fc8"
  type: "InnerProduct"
  bottom: "fc7"
  top: "fc8"
  inner_product_param {
    num_output: 2
  }
}
layer {
  name: "prob"
  type: "Softmax"
  bottom: "fc8"
  top: "prob"
}
'''
    with open(dest, "w") as f:
        f.write(content)
    print(f"  ✔ Created: {os.path.basename(dest)} (embedded)")


def download_all() -> None:
    """Download all required model files."""
    os.makedirs(MODELS_DIR, exist_ok=True)
    print(f"📂 Model directory: {MODELS_DIR}\n")

    for filename, url in FILES.items():
        dest = os.path.join(MODELS_DIR, filename)

        if os.path.isfile(dest):
            size_mb = os.path.getsize(dest) / 1e6
            print(f"  ✔ Already exists: {filename} ({size_mb:.1f} MB)")
            continue

        success = download_file(url, dest)

        if not success:
            # Try fallback
            fallback = FALLBACK_URLS.get(filename)
            if fallback:
                print(f"  ↻ Trying fallback URL for {filename}…")
                success = download_file(fallback, dest)

            # Special case: create prototxt manually
            if not success and filename == "gender_deploy.prototxt":
                create_gender_prototxt_manually(dest)
                success = True

            if not success:
                print(f"  ❌ Could not download: {filename}")

    # Verify all files exist
    print("\n── Verification ──")
    all_ok = True
    for filename in FILES:
        path = os.path.join(MODELS_DIR, filename)
        if os.path.isfile(path):
            size_mb = os.path.getsize(path) / 1e6
            print(f"  ✅ {filename} ({size_mb:.1f} MB)")
        else:
            print(f"  ❌ {filename} — MISSING")
            all_ok = False

    if all_ok:
        print(f"\n✅ All models ready!")
    else:
        print(f"\n⚠️ Some models are missing. Gender detection may not work.")


if __name__ == "__main__":
    download_all()
