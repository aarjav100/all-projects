"""
app.py — AI Vision Analytics Dashboard
=========================================
Premium Streamlit dashboard with YOLOv8 object detection,
face detection, and gender classification.

Features: image/video/webcam modes, gender analytics,
object distribution, alerts, insights, detection history,
CSV report download, and glassmorphism dark UI.
"""

import time
import tempfile
from datetime import datetime

import cv2
import numpy as np
import pandas as pd
import streamlit as st

from model_loader import (
    load_yolo, load_face_detector, load_gender_classifier,
    get_available_models, get_device, get_device_info,
)
from detection import run_full_pipeline
from utils import (
    calculate_fps,
    resize_frame,
    generate_insights,
    check_alerts,
    save_detection_log,
    generate_csv_report,
)


# ──────────────────────────────────────────────
# Page config
# ──────────────────────────────────────────────

st.set_page_config(
    page_title="🔍 AI Vision Analytics",
    page_icon="🔍",
    layout="wide",
    initial_sidebar_state="expanded",
)


# ──────────────────────────────────────────────
# Session state
# ──────────────────────────────────────────────

for key, default in [
    ("detection_history", []),
    ("fps_history", []),
    ("obj_trend", []),
    ("person_trend", []),
    ("webcam_running", False),
]:
    if key not in st.session_state:
        st.session_state[key] = default


# ──────────────────────────────────────────────
# CSS — Premium dark + glassmorphism
# ──────────────────────────────────────────────

st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box}
html,body,.stApp{
    font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;
    background:#07080a;color:#e2e8f0;
}
.stApp{
    background:
        radial-gradient(ellipse at 10% 8%,rgba(56,189,248,.06) 0%,transparent 50%),
        radial-gradient(ellipse at 90% 85%,rgba(168,85,247,.06) 0%,transparent 50%),
        radial-gradient(ellipse at 50% 50%,rgba(16,185,129,.03) 0%,transparent 60%),
        #07080a;
}
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-thumb{background:#334155;border-radius:3px}

/* Sidebar */
section[data-testid="stSidebar"]{
    background:linear-gradient(180deg,#0c0e14,#0f1119);
    border-right:1px solid rgba(148,163,184,.08);
}
section[data-testid="stSidebar"] .stMarkdown h2{
    color:#38bdf8;font-weight:700;font-size:1.05rem;letter-spacing:.5px;
}

/* Glass card */
.g{
    background:linear-gradient(135deg,rgba(15,23,42,.7),rgba(15,23,42,.35));
    backdrop-filter:blur(20px);
    border:1px solid rgba(148,163,184,.1);
    border-radius:16px;padding:1.4rem;
    transition:all .3s cubic-bezier(.4,0,.2,1);
    box-shadow:0 4px 24px rgba(0,0,0,.3),inset 0 1px 0 rgba(255,255,255,.04);
}
.g:hover{
    border-color:rgba(56,189,248,.2);
    box-shadow:0 8px 40px rgba(0,0,0,.4),0 0 25px rgba(56,189,248,.05);
    transform:translateY(-2px);
}

/* Hero */
.hero{
    background:linear-gradient(135deg,rgba(15,23,42,.8),rgba(30,41,59,.5),rgba(15,23,42,.8));
    backdrop-filter:blur(24px);
    border:1px solid rgba(148,163,184,.08);
    border-radius:20px;padding:2rem 2.5rem;
    margin-bottom:1.5rem;text-align:center;
    position:relative;overflow:hidden;
}
.hero::before{
    content:'';position:absolute;top:0;left:0;right:0;height:2px;
    background:linear-gradient(90deg,transparent,#38bdf8 20%,#a855f7 50%,#10b981 80%,transparent);
}
.hero-t{
    font-size:2.2rem;font-weight:800;
    background:linear-gradient(135deg,#38bdf8,#a855f7,#10b981);
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;
    background-clip:text;margin:0 0 .3rem;
}
.hero-s{font-size:.92rem;color:#94a3b8;margin:0 0 .1rem}
.hero-d{font-size:.78rem;color:#64748b;margin:0}

/* Metric card */
.mc{
    background:linear-gradient(135deg,rgba(15,23,42,.7),rgba(15,23,42,.3));
    backdrop-filter:blur(16px);
    border:1px solid rgba(148,163,184,.08);
    border-radius:14px;padding:1rem .6rem;
    text-align:center;transition:all .3s;
    position:relative;overflow:hidden;
}
.mc::after{content:'';position:absolute;bottom:0;left:0;right:0;height:3px;border-radius:0 0 14px 14px}
.mc:hover{transform:translateY(-2px);border-color:rgba(148,163,184,.15)}
.mc.c1::after{background:linear-gradient(90deg,#38bdf8,#0ea5e9)}
.mc.c2::after{background:linear-gradient(90deg,#a855f7,#c084fc)}
.mc.c3::after{background:linear-gradient(90deg,#38bdf8,#60a5fa)}
.mc.c4::after{background:linear-gradient(90deg,#ec4899,#f472b6)}
.mc.c5::after{background:linear-gradient(90deg,#10b981,#34d399)}
.mc.c6::after{background:linear-gradient(90deg,#f59e0b,#fbbf24)}
.mi{font-size:1.3rem;margin-bottom:.15rem}
.mv{font-size:1.6rem;font-weight:800;letter-spacing:-1px;line-height:1}
.mv.cyan{color:#38bdf8}.mv.purple{color:#c084fc}.mv.blue{color:#60a5fa}
.mv.pink{color:#f472b6}.mv.green{color:#34d399}.mv.amber{color:#fbbf24}
.ml{font-size:.65rem;color:#64748b;text-transform:uppercase;letter-spacing:1.2px;margin-top:.25rem;font-weight:600}

/* Stats table */
.st-g{
    background:linear-gradient(135deg,rgba(15,23,42,.6),rgba(15,23,42,.3));
    backdrop-filter:blur(16px);
    border:1px solid rgba(148,163,184,.08);
    border-radius:14px;padding:.7rem .9rem;margin-top:.7rem;
}
.st-t{font-size:.7rem;color:#64748b;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;margin-bottom:.4rem}
.sr{display:flex;justify-content:space-between;align-items:center;padding:.35rem .3rem;border-bottom:1px solid rgba(148,163,184,.06);font-size:.82rem}
.sr:last-child{border-bottom:none}
.sr .n{color:#e2e8f0;font-weight:500}
.sr .c{
    background:linear-gradient(135deg,rgba(56,189,248,.15),rgba(168,85,247,.15));
    color:#38bdf8;font-weight:700;padding:.1rem .6rem;border-radius:20px;
    font-size:.78rem;border:1px solid rgba(56,189,248,.15);
}

/* Section header */
.sh{display:flex;align-items:center;gap:.5rem;margin-bottom:.8rem}
.sh .i{font-size:1.15rem}
.sh .t{font-size:1.05rem;font-weight:700;color:#e2e8f0}
.sh .b{
    background:linear-gradient(135deg,rgba(56,189,248,.12),rgba(168,85,247,.12));
    color:#38bdf8;font-size:.6rem;font-weight:600;padding:.1rem .5rem;
    border-radius:20px;border:1px solid rgba(56,189,248,.15);
    text-transform:uppercase;letter-spacing:.8px;
}

/* Image container */
.ic{
    background:linear-gradient(135deg,rgba(15,23,42,.5),rgba(15,23,42,.25));
    backdrop-filter:blur(12px);border:1px solid rgba(148,163,184,.08);
    border-radius:14px;padding:.4rem;
}
.il{font-size:.68rem;color:#64748b;text-transform:uppercase;letter-spacing:1.2px;font-weight:700;text-align:center;margin-bottom:.3rem}

/* Alert */
.al{
    background:linear-gradient(135deg,rgba(239,68,68,.12),rgba(239,68,68,.05));
    border:1px solid rgba(239,68,68,.25);border-radius:12px;
    padding:.7rem 1rem;margin-bottom:.4rem;
    display:flex;align-items:center;gap:.5rem;
}
.al .at{color:#fca5a5;font-size:.85rem;font-weight:500}

/* Insight */
.ins{
    background:linear-gradient(135deg,rgba(56,189,248,.08),rgba(168,85,247,.06));
    border:1px solid rgba(56,189,248,.12);border-radius:12px;
    padding:.55rem .9rem;margin-bottom:.35rem;font-size:.85rem;color:#cbd5e1;
}

/* Buttons */
.stButton>button{
    background:linear-gradient(135deg,rgba(56,189,248,.1),rgba(168,85,247,.1));
    border:1px solid rgba(56,189,248,.25);color:#38bdf8;font-weight:600;
    border-radius:10px;transition:all .3s;
}
.stButton>button:hover{
    background:linear-gradient(135deg,rgba(56,189,248,.2),rgba(168,85,247,.2));
    border-color:rgba(56,189,248,.5);box-shadow:0 0 20px rgba(56,189,248,.15);
    transform:translateY(-1px);
}
.stDownloadButton>button{
    background:linear-gradient(135deg,rgba(16,185,129,.12),rgba(52,211,153,.12));
    border:1px solid rgba(16,185,129,.25);color:#34d399;font-weight:600;border-radius:10px;
}
.stDownloadButton>button:hover{
    background:linear-gradient(135deg,rgba(16,185,129,.25),rgba(52,211,153,.25));
    box-shadow:0 0 20px rgba(16,185,129,.15);
}

.stSlider>div>div>div>div{background:linear-gradient(90deg,#38bdf8,#a855f7)!important}

.stFileUploader>div{
    border:2px dashed rgba(148,163,184,.12)!important;
    border-radius:14px!important;background:rgba(15,23,42,.3)!important;
}
.stFileUploader>div:hover{border-color:rgba(56,189,248,.25)!important}

hr{border:none;height:1px;background:linear-gradient(90deg,transparent,rgba(148,163,184,.1) 30%,rgba(148,163,184,.1) 70%,transparent);margin:1rem 0}

.foot{
    background:linear-gradient(135deg,rgba(15,23,42,.4),rgba(15,23,42,.2));
    backdrop-filter:blur(12px);border:1px solid rgba(148,163,184,.06);
    border-radius:12px;padding:.7rem;text-align:center;margin-top:1.5rem;
}
.foot p{color:#475569;font-size:.75rem;margin:0}
.foot span{color:#64748b;font-weight:600}

#MainMenu{visibility:hidden}footer{visibility:hidden}header{visibility:hidden}
</style>
""", unsafe_allow_html=True)


# ──────────────────────────────────────────────
# Hero
# ──────────────────────────────────────────────

st.markdown(
    '<div class="hero">'
    '<div class="hero-t">🔍 AI Vision Analytics</div>'
    '<p class="hero-s">Object Detection &bull; Face Detection &bull; Gender Classification</p>'
    '<p class="hero-d">Powered by YOLOv8 &bull; OpenCV DNN &bull; Caffe Models</p>'
    '</div>',
    unsafe_allow_html=True,
)


# ──────────────────────────────────────────────
# Sidebar Controls
# ──────────────────────────────────────────────

with st.sidebar:
    st.markdown("## ⚙️ Control Panel")

    # Device
    dev = get_device_info()
    de = "🟢" if dev["device"] == "cuda" else "🔵"
    st.markdown(
        f'<div class="g" style="padding:.7rem;margin-bottom:.8rem;">'
        f'<div style="font-size:.68rem;color:#64748b;text-transform:uppercase;letter-spacing:1px;font-weight:700;margin-bottom:.2rem">Device</div>'
        f'<div style="font-size:.9rem;color:#e2e8f0;font-weight:600">{de} {dev["name"]}</div>'
        f'<div style="font-size:.72rem;color:#94a3b8">{dev["device"].upper()}</div>'
        f'</div>',
        unsafe_allow_html=True,
    )

    st.divider()
    models = get_available_models()
    sel_model = st.selectbox("🧠 Model", list(models.keys()), index=0)
    weight = models[sel_model]

    st.divider()
    confidence = st.slider("🎯 Confidence", 0.0, 1.0, 0.35, 0.05)

    st.divider()
    mode = st.radio("📸 Mode", ["🖼️ Image", "🎬 Video", "📹 Webcam"], index=0)

    st.divider()
    max_width = st.slider("📐 Frame Width", 320, 1280, 640, 64)

    st.divider()
    gender_on = st.toggle("👤 Gender Detection", value=True, help="Detect faces and classify gender inside person boxes")
    save_logs = st.toggle("📝 Save Logs", value=False)

    st.divider()
    st.markdown("##### 🚨 Alert")
    alert_on = st.toggle("Enable Alert", value=False)
    person_thresh = 10
    if alert_on:
        person_thresh = st.number_input("Person threshold", 1, 100, 10)


# ──────────────────────────────────────────────
# Load all models
# ──────────────────────────────────────────────

yolo = load_yolo(weight)
face_net = load_face_detector()
gender_net = load_gender_classifier()
device = get_device()


# ──────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────

def add_history(source, fps, analytics):
    """Add an entry to detection history."""
    st.session_state.detection_history.append({
        "timestamp": datetime.now().strftime("%H:%M:%S"),
        "source": source,
        "fps": fps,
        "total": analytics["total_objects"],
        "persons": analytics["person_count"],
        "males": analytics["male_count"],
        "females": analytics["female_count"],
        "objects": analytics["object_counts"],
    })
    st.session_state.fps_history.append(fps)
    st.session_state.obj_trend.append(analytics["total_objects"])
    st.session_state.person_trend.append(analytics["person_count"])
    # Keep bounded
    for k in ("fps_history", "obj_trend", "person_trend"):
        if len(st.session_state[k]) > 100:
            st.session_state[k] = st.session_state[k][-100:]
    if len(st.session_state.detection_history) > 200:
        st.session_state.detection_history = st.session_state.detection_history[-200:]


def render_analytics(fps, analytics):
    """Render the 6-card metrics row + object breakdown."""
    a = analytics
    cols = st.columns(6)

    cards = [
        ("⚡", fps, "FPS", "cyan", "c1"),
        ("📦", a["total_objects"], "Objects", "purple", "c2"),
        ("🧑", a["person_count"], "Persons", "blue", "c3"),
        ("♂️", a["male_count"], "Male", "blue", "c3"),
        ("♀️", a["female_count"], "Female", "pink", "c4"),
        ("🏷️", len(a["object_counts"]), "Classes", "green", "c5"),
    ]

    for col, (icon, val, label, color, cls) in zip(cols, cards):
        with col:
            st.markdown(
                f'<div class="mc {cls}"><div class="mi">{icon}</div>'
                f'<div class="mv {color}">{val}</div>'
                f'<div class="ml">{label}</div></div>',
                unsafe_allow_html=True,
            )

    # Gender ratio bar
    m, f = a["male_count"], a["female_count"]
    if m + f > 0:
        m_pct = m / (m + f) * 100
        f_pct = 100 - m_pct
        st.markdown(
            f'<div class="g" style="padding:.6rem;margin-top:.6rem">'
            f'<div style="font-size:.68rem;color:#64748b;text-transform:uppercase;letter-spacing:1.2px;font-weight:700;margin-bottom:.4rem">Gender Ratio</div>'
            f'<div style="display:flex;height:22px;border-radius:11px;overflow:hidden;border:1px solid rgba(148,163,184,.1)">'
            f'<div style="width:{m_pct}%;background:linear-gradient(90deg,#38bdf8,#60a5fa);display:flex;align-items:center;justify-content:center;font-size:.65rem;font-weight:700;color:#0f172a">'
            f'♂ {m_pct:.0f}%</div>'
            f'<div style="width:{f_pct}%;background:linear-gradient(90deg,#ec4899,#f472b6);display:flex;align-items:center;justify-content:center;font-size:.65rem;font-weight:700;color:#0f172a">'
            f'♀ {f_pct:.0f}%</div>'
            f'</div></div>',
            unsafe_allow_html=True,
        )

    # Object counts table
    oc = a["object_counts"]
    if oc:
        rows = "".join(
            f'<div class="sr"><span class="n">{cls}</span><span class="c">{cnt}</span></div>'
            for cls, cnt in sorted(oc.items(), key=lambda x: -x[1])
        )
        st.markdown(
            f'<div class="st-g"><div class="st-t">📊 Object Distribution</div>{rows}</div>',
            unsafe_allow_html=True,
        )


def render_alerts_ui(analytics):
    """Show alert banners."""
    if not alert_on:
        return
    alerts = check_alerts(analytics, person_thresh)
    for msg in alerts:
        st.markdown(f'<div class="al"><span class="at">{msg}</span></div>', unsafe_allow_html=True)


def render_insights_ui(analytics):
    """Show AI insights."""
    insights = generate_insights(analytics)
    if insights:
        with st.expander("🧠 AI Insights", expanded=True):
            for ins in insights:
                st.markdown(f'<div class="ins">{ins}</div>', unsafe_allow_html=True)


def render_dashboard():
    """FPS + object trend charts."""
    if len(st.session_state.fps_history) < 2:
        return
    with st.expander("📈 Performance Dashboard", expanded=False):
        c1, c2 = st.columns(2)
        with c1:
            st.markdown("**FPS Over Time**")
            st.line_chart(st.session_state.fps_history, height=180)
        with c2:
            st.markdown("**Object / Person Trends**")
            df = pd.DataFrame({
                "Objects": st.session_state.obj_trend,
                "Persons": st.session_state.person_trend,
            })
            st.area_chart(df, height=180)


def render_history():
    """Detection history table + CSV download."""
    hist = st.session_state.detection_history
    if not hist:
        return
    with st.expander(f"📋 History ({len(hist)} entries)", expanded=False):
        df = pd.DataFrame(hist[-20:][::-1])
        display_cols = [c for c in ["timestamp","source","fps","total","persons","males","females"] if c in df.columns]
        st.dataframe(df[display_cols], width='stretch', hide_index=True)
        csv = generate_csv_report(hist)
        st.download_button(
            "📥 Download CSV Report", csv,
            f"report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
            "text/csv", width='stretch',
        )


# ══════════════════════════════════════════════
#  🖼️ IMAGE MODE
# ══════════════════════════════════════════════

if mode == "🖼️ Image":
    st.markdown(
        '<div class="sh"><span class="i">🖼️</span><span class="t">Image Detection</span><span class="b">Upload</span></div>',
        unsafe_allow_html=True,
    )
    uploaded = st.file_uploader("Drop image", type=["jpg","jpeg","png","bmp","webp"], key="img", label_visibility="collapsed")

    if uploaded:
        raw = np.asarray(bytearray(uploaded.read()), dtype=np.uint8)
        frame = cv2.imdecode(raw, cv2.IMREAD_COLOR)
        if frame is None:
            st.error("❌ Invalid image.")
        else:
            resized = resize_frame(frame, max_width)
            t0 = time.time()
            annotated, analytics = run_full_pipeline(
                resized, yolo, face_net, gender_net,
                confidence, device, gender_on,
            )
            fps, _ = calculate_fps(t0)

            render_alerts_ui(analytics)

            c1, c2 = st.columns(2)
            with c1:
                st.markdown('<div class="ic"><div class="il">Original</div></div>', unsafe_allow_html=True)
                st.image(cv2.cvtColor(resized, cv2.COLOR_BGR2RGB), width='stretch')
            with c2:
                st.markdown('<div class="ic"><div class="il">Detected</div></div>', unsafe_allow_html=True)
                st.image(cv2.cvtColor(annotated, cv2.COLOR_BGR2RGB), width='stretch')

            render_analytics(fps, analytics)
            render_insights_ui(analytics)
            add_history("image", fps, analytics)

            st.divider()
            dc1, dc2 = st.columns(2)
            with dc1:
                _, enc = cv2.imencode(".png", annotated)
                st.download_button("⬇️ Download Image", enc.tobytes(), "detected.png", "image/png", width='stretch')
            with dc2:
                csv = generate_csv_report(st.session_state.detection_history[-1:])
                st.download_button("📥 Download Report", csv, "report.csv", "text/csv", width='stretch')

            if save_logs:
                save_detection_log(analytics, fps, "image")

            render_dashboard()
            render_history()


# ══════════════════════════════════════════════
#  🎬 VIDEO MODE
# ══════════════════════════════════════════════

elif mode == "🎬 Video":
    st.markdown(
        '<div class="sh"><span class="i">🎬</span><span class="t">Video Detection</span><span class="b">Upload</span></div>',
        unsafe_allow_html=True,
    )
    uploaded = st.file_uploader("Drop video", type=["mp4","avi","mov","mkv"], key="vid", label_visibility="collapsed")

    if uploaded:
        tfile = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4")
        tfile.write(uploaded.read())
        tfile.flush()
        cap = cv2.VideoCapture(tfile.name)
        if not cap.isOpened():
            st.error("❌ Invalid video.")
        else:
            st.info("⏳ Processing…", icon="🎬")
            stframe = st.empty()
            metrics_area = st.empty()
            alert_area = st.empty()
            t0 = time.time()
            fc = 0

            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break
                fc += 1
                resized = resize_frame(frame, max_width)
                annotated, analytics = run_full_pipeline(
                    resized, yolo, face_net, gender_net,
                    confidence, device, gender_on,
                )
                fps, t0 = calculate_fps(t0)

                cv2.putText(annotated, f"FPS: {fps}", (10,30), cv2.FONT_HERSHEY_SIMPLEX, .9, (56,189,248), 2, cv2.LINE_AA)
                stframe.image(cv2.cvtColor(annotated, cv2.COLOR_BGR2RGB), width='stretch')

                with metrics_area.container():
                    render_analytics(fps, analytics)
                with alert_area.container():
                    render_alerts_ui(analytics)

                add_history("video", fps, analytics)

            cap.release()
            if save_logs:
                save_detection_log(analytics, fps, "video")
            st.success(f"✅ Done — **{fc}** frames", icon="🎬")
            render_insights_ui(analytics)
            render_dashboard()
            render_history()


# ══════════════════════════════════════════════
#  📹 WEBCAM MODE
# ══════════════════════════════════════════════

elif mode == "📹 Webcam":
    st.markdown(
        '<div class="sh"><span class="i">📹</span><span class="t">Live Webcam</span><span class="b">Stream</span></div>',
        unsafe_allow_html=True,
    )

    bc1, bc2 = st.columns(2)
    if bc1.button("▶️ Start", width='stretch'):
        st.session_state.webcam_running = True
    if bc2.button("⏹️ Stop", width='stretch'):
        st.session_state.webcam_running = False

    if st.session_state.webcam_running:
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            st.error("❌ No webcam.")
            st.session_state.webcam_running = False
        else:
            stframe = st.empty()
            metrics_area = st.empty()
            alert_area = st.empty()
            t0 = time.time()

            while st.session_state.webcam_running:
                ret, frame = cap.read()
                if not ret:
                    st.warning("⚠️ Lost feed.")
                    break

                resized = resize_frame(frame, max_width)
                annotated, analytics = run_full_pipeline(
                    resized, yolo, face_net, gender_net,
                    confidence, device, gender_on,
                )
                fps, t0 = calculate_fps(t0)

                cv2.putText(annotated, f"FPS: {fps}", (10,30), cv2.FONT_HERSHEY_SIMPLEX, .9, (56,189,248), 2, cv2.LINE_AA)
                cv2.putText(annotated, f"Persons: {analytics['person_count']}", (10,65), cv2.FONT_HERSHEY_SIMPLEX, .7, (52,211,153), 2, cv2.LINE_AA)

                stframe.image(cv2.cvtColor(annotated, cv2.COLOR_BGR2RGB), width='stretch')
                with metrics_area.container():
                    render_analytics(fps, analytics)
                with alert_area.container():
                    render_alerts_ui(analytics)

                add_history("webcam", fps, analytics)

            cap.release()
            st.info("📹 Stopped.")
            render_dashboard()
            render_history()
    else:
        st.markdown(
            '<div class="g" style="text-align:center;padding:2.5rem">'
            '<div style="font-size:2.5rem;margin-bottom:.5rem">📹</div>'
            '<div style="color:#94a3b8">Click <b style="color:#38bdf8">▶️ Start</b> to begin</div>'
            '</div>',
            unsafe_allow_html=True,
        )


# ──────────────────────────────────────────────
# Footer
# ──────────────────────────────────────────────

st.markdown(
    '<div class="foot">'
    '<p>Built with ❤️ using <span>YOLOv8</span> &bull; <span>OpenCV DNN</span> &bull; <span>Streamlit</span></p>'
    '</div>',
    unsafe_allow_html=True,
)
