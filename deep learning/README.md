# 🔍 AI Vision Analytics — Object Detection & Gender Classification

Real-time object detection with person identification, face detection,
and gender classification powered by **YOLOv8**, **OpenCV DNN**, and **Streamlit**.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📦 Object Detection | YOLOv8 with bounding boxes, labels, confidence |
| 👤 Gender Classification | Detects faces inside person boxes → Male/Female |
| 📊 Analytics Dashboard | 6 metric cards, gender ratio bar, object distribution |
| 🖼️ Image Upload | Upload & detect with side-by-side view |
| 🎬 Video Upload | Frame-by-frame detection with live stats |
| 📹 Webcam | Real-time live stream detection |
| 🧠 AI Insights | Crowd density, gender split, traffic analysis |
| 🚨 Alert System | Configurable person-count threshold alerts |
| 📈 Performance Dashboard | FPS & object trend charts |
| 📋 Detection History | Timestamped log with CSV export |
| ⬇️ Downloads | Processed images & CSV reports |

---

## 📁 Project Structure

```
deep learning/
├── app.py                  # Streamlit dashboard
├── model_loader.py         # YOLO + face + gender model loading
├── detection.py            # Full 3-stage detection pipeline
├── face_detector.py        # OpenCV DNN face detection
├── gender_classifier.py    # Caffe gender classification
├── utils.py                # FPS, resize, insights, alerts, logging
├── download_models.py      # Auto-download pretrained models
├── requirements.txt        # Dependencies
├── README.md               # This file
├── models/                 # Pretrained model weights
│   ├── deploy.prototxt
│   ├── res10_300x300_ssd_iter_140000.caffemodel
│   ├── gender_deploy.prototxt
│   └── gender_net.caffemodel
└── detection_logs/         # Auto-created CSV logs
```

---

## 🚀 Setup & Run

### 1. Install Dependencies

```bash
cd "deep learning"
pip install -r requirements.txt
```

### 2. Download Pretrained Models

```bash
python download_models.py
```

This downloads ~50 MB of face detection & gender classification models.
YOLOv8 weights are auto-downloaded on first run (~6 MB).

### 3. Launch the App

```bash
python -m streamlit run app.py
```

Opens at **http://localhost:8501**.

> **GPU:** Automatically uses CUDA if available, otherwise CPU.

---

## 🌐 Google Colab

```python
!pip install -q streamlit ultralytics opencv-python-headless torch pillow pandas

# Upload all .py files, then:
!python download_models.py
!npm install -g localtunnel
!nohup streamlit run app.py --server.port 8501 &
!npx localtunnel --port 8501
```

---

## 🐳 Docker

```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY . .
RUN pip install --no-cache-dir -r requirements.txt
RUN python download_models.py
EXPOSE 8501
CMD ["streamlit", "run", "app.py", "--server.port=8501", "--server.address=0.0.0.0"]
```

```bash
docker build -t vision-analytics .
docker run -p 8501:8501 vision-analytics
```

---

## 🧠 How It Works

```
Frame → YOLOv8 Detection
            ↓
      person detected?
       ↙          ↘
     no            yes
     ↓              ↓
  draw box    extract person ROI
                    ↓
              DNN face detection
                    ↓
              gender classification
                    ↓
           draw box + gender label
```

---

## 📄 License

MIT
