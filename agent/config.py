"""
Configuration for AI Screen-Reader Assistant
"""

import os

# ============================================
# GOOGLE GEMINI API CONFIGURATION
# ============================================
# Get your free API key at: https://makersuite.google.com/app/apikey
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyDNHmgOP9b4-K0DKwhiGDdVQl_-XnkUxdU")

# ============================================
# TESSERACT OCR CONFIGURATION
# ============================================
# Default installation path on Windows
# Download from: https://github.com/UB-Mannheim/tesseract/wiki
TESSERACT_PATH = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# ============================================
# HOTKEY CONFIGURATION
# ============================================
HOTKEYS = {
    "capture_region": "<ctrl>+<shift>+r",
    "capture_fullscreen": "<ctrl>+<shift>+f",
    "quick_explain": "<ctrl>+<shift>+e",
    "read_aloud": "<ctrl>+<shift>+s",
    "copy_answer": "<ctrl>+<shift>+c",
}

# ============================================
# AI ASSISTANT SETTINGS
# ============================================
AI_SYSTEM_PROMPT = """You are a helpful learning assistant. When given text from a screen capture:

1. If it's a question: Explain the concept and suggest how to find the answer (don't give direct answers for educational purposes)
2. If it's educational content: Summarize and explain key concepts
3. If it's code: Explain what it does and any improvements
4. If it's unclear: Ask for clarification

Be concise, friendly, and educational. Help the user learn and understand."""

# ============================================
# UI SETTINGS
# ============================================
WINDOW_OPACITY = 0.95
FLOATING_WIDGET_SIZE = (300, 50)
MAIN_WINDOW_SIZE = (900, 700)
