"""Core modules for AI Screen-Reader Assistant"""

from .screen_capture import ScreenCapture
from .ocr_engine import OCREngine
from .ai_assistant import AIAssistant
from .tts_engine import TTSEngine

__all__ = ["ScreenCapture", "OCREngine", "AIAssistant", "TTSEngine"]
