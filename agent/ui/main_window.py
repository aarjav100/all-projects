"""
Main Window Module
Primary application window with all features
"""

from PyQt6.QtWidgets import (
    QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, QPushButton,
    QLabel, QTextEdit, QSplitter, QListWidget, QListWidgetItem,
    QFrame, QScrollArea, QApplication, QMessageBox
)
from PyQt6.QtCore import Qt, QByteArray, pyqtSignal, QTimer
from PyQt6.QtGui import QPixmap, QImage, QClipboard
from PIL import Image
from datetime import datetime
import os


class MainWindow(QMainWindow):
    """Main application window"""
    
    # Signals
    request_capture_region = pyqtSignal()
    request_capture_fullscreen = pyqtSignal()
    
    def __init__(self, screen_capture, ocr_engine, ai_assistant, tts_engine):
        super().__init__()
        
        # Core components
        self.screen_capture = screen_capture
        self.ocr_engine = ocr_engine
        self.ai_assistant = ai_assistant
        self.tts_engine = tts_engine
        
        # State
        self.current_image = None
        self.current_text = ""
        self.current_explanation = ""
        self.history = []
        
        self._setup_ui()
        self._load_styles()
        self._check_dependencies()
    
    def _setup_ui(self):
        """Setup the main window UI"""
        self.setWindowTitle("AI Screen-Reader Assistant")
        self.setMinimumSize(900, 700)
        self.setObjectName("MainWindow")
        
        # Central widget
        central = QWidget()
        self.setCentralWidget(central)
        
        # Main layout
        main_layout = QHBoxLayout(central)
        main_layout.setContentsMargins(20, 20, 20, 20)
        main_layout.setSpacing(15)
        
        # Create splitter for main content and history
        splitter = QSplitter(Qt.Orientation.Horizontal)
        
        # === Left Panel (Main Content) ===
        left_panel = QWidget()
        left_layout = QVBoxLayout(left_panel)
        left_layout.setContentsMargins(0, 0, 0, 0)
        left_layout.setSpacing(15)
        
        # Header
        header = QWidget()
        header_layout = QHBoxLayout(header)
        header_layout.setContentsMargins(0, 0, 0, 0)
        
        title = QLabel("🔍 AI Screen-Reader")
        title.setObjectName("titleLabel")
        header_layout.addWidget(title)
        
        header_layout.addStretch()
        
        # Status indicator
        self.status_label = QLabel("Ready")
        self.status_label.setObjectName("statusSuccess")
        header_layout.addWidget(self.status_label)
        
        left_layout.addWidget(header)
        
        # Capture buttons
        btn_row = QWidget()
        btn_layout = QHBoxLayout(btn_row)
        btn_layout.setContentsMargins(0, 0, 0, 0)
        btn_layout.setSpacing(10)
        
        self.btn_capture_region = QPushButton("📷 Capture Region")
        self.btn_capture_region.setToolTip("Ctrl+Shift+R")
        self.btn_capture_region.clicked.connect(self.request_capture_region.emit)
        btn_layout.addWidget(self.btn_capture_region)
        
        self.btn_capture_full = QPushButton("🖥️ Full Screen")
        self.btn_capture_full.setToolTip("Ctrl+Shift+F")
        self.btn_capture_full.clicked.connect(self.request_capture_fullscreen.emit)
        btn_layout.addWidget(self.btn_capture_full)
        
        btn_layout.addStretch()
        
        left_layout.addWidget(btn_row)
        
        # Image preview
        preview_label = QLabel("Captured Image")
        preview_label.setObjectName("sectionLabel")
        left_layout.addWidget(preview_label)
        
        self.image_preview = QLabel("Click 'Capture Region' or 'Full Screen' to start")
        self.image_preview.setObjectName("imagePreview")
        self.image_preview.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.image_preview.setMinimumHeight(150)
        self.image_preview.setMaximumHeight(250)
        self.image_preview.setScaledContents(False)
        left_layout.addWidget(self.image_preview)
        
        # Extracted text section
        text_header = QWidget()
        text_header_layout = QHBoxLayout(text_header)
        text_header_layout.setContentsMargins(0, 0, 0, 0)
        
        text_label = QLabel("Extracted Text")
        text_label.setObjectName("sectionLabel")
        text_header_layout.addWidget(text_label)
        
        text_header_layout.addStretch()
        
        self.btn_copy_text = QPushButton("📋 Copy")
        self.btn_copy_text.setObjectName("secondaryBtn")
        self.btn_copy_text.setFixedWidth(80)
        self.btn_copy_text.clicked.connect(self._copy_text)
        text_header_layout.addWidget(self.btn_copy_text)
        
        left_layout.addWidget(text_header)
        
        self.text_display = QTextEdit()
        self.text_display.setPlaceholderText("Extracted text will appear here...")
        self.text_display.setReadOnly(True)
        self.text_display.setMaximumHeight(120)
        left_layout.addWidget(self.text_display)
        
        # AI Explanation section
        ai_header = QWidget()
        ai_header_layout = QHBoxLayout(ai_header)
        ai_header_layout.setContentsMargins(0, 0, 0, 0)
        
        ai_label = QLabel("✨ AI Explanation")
        ai_label.setObjectName("sectionLabel")
        ai_header_layout.addWidget(ai_label)
        
        ai_header_layout.addStretch()
        
        self.btn_explain = QPushButton("🤖 Explain")
        self.btn_explain.clicked.connect(self._get_explanation)
        self.btn_explain.setFixedWidth(100)
        ai_header_layout.addWidget(self.btn_explain)
        
        self.btn_speak = QPushButton("🔊 Read")
        self.btn_speak.setObjectName("secondaryBtn")
        self.btn_speak.setFixedWidth(80)
        self.btn_speak.clicked.connect(self._speak_explanation)
        ai_header_layout.addWidget(self.btn_speak)
        
        self.btn_stop_speak = QPushButton("⏹️")
        self.btn_stop_speak.setObjectName("dangerBtn")
        self.btn_stop_speak.setFixedWidth(40)
        self.btn_stop_speak.clicked.connect(self._stop_speaking)
        ai_header_layout.addWidget(self.btn_stop_speak)
        
        self.btn_copy_explanation = QPushButton("📋 Copy")
        self.btn_copy_explanation.setObjectName("secondaryBtn")
        self.btn_copy_explanation.setFixedWidth(80)
        self.btn_copy_explanation.clicked.connect(self._copy_explanation)
        ai_header_layout.addWidget(self.btn_copy_explanation)
        
        left_layout.addWidget(ai_header)
        
        self.explanation_display = QTextEdit()
        self.explanation_display.setPlaceholderText("AI explanation will appear here after clicking 'Explain'...")
        self.explanation_display.setReadOnly(True)
        left_layout.addWidget(self.explanation_display)
        
        splitter.addWidget(left_panel)
        
        # === Right Panel (History) ===
        right_panel = QFrame()
        right_panel.setObjectName("card")
        right_panel.setMaximumWidth(280)
        right_layout = QVBoxLayout(right_panel)
        right_layout.setContentsMargins(15, 15, 15, 15)
        
        history_label = QLabel("📜 History")
        history_label.setObjectName("sectionLabel")
        right_layout.addWidget(history_label)
        
        self.history_list = QListWidget()
        self.history_list.itemClicked.connect(self._load_history_item)
        right_layout.addWidget(self.history_list)
        
        self.btn_clear_history = QPushButton("🗑️ Clear History")
        self.btn_clear_history.setObjectName("secondaryBtn")
        self.btn_clear_history.clicked.connect(self._clear_history)
        right_layout.addWidget(self.btn_clear_history)
        
        splitter.addWidget(right_panel)
        
        # Set splitter proportions
        splitter.setSizes([700, 200])
        
        main_layout.addWidget(splitter)
    
    def _load_styles(self):
        """Load the QSS stylesheet"""
        style_path = os.path.join(os.path.dirname(__file__), "styles.qss")
        if os.path.exists(style_path):
            with open(style_path, "r") as f:
                self.setStyleSheet(f.read())
    
    def _check_dependencies(self):
        """Check if required dependencies are available"""
        warnings = []
        
        if not self.ocr_engine.is_tesseract_installed():
            warnings.append("⚠️ Tesseract OCR not found. Please install it.")
        
        if not self.ai_assistant.is_configured():
            warnings.append("⚠️ Gemini API not configured. Add your API key to config.py")
        
        if not self.tts_engine.is_available():
            warnings.append("⚠️ Text-to-speech not available")
        
        if warnings:
            self.status_label.setText("; ".join(warnings))
            self.status_label.setObjectName("statusWarning")
    
    def set_captured_image(self, image: Image.Image):
        """Display a captured image"""
        self.current_image = image
        
        # Convert PIL Image to QPixmap
        img_data = self.screen_capture.image_to_bytes(image)
        pixmap = QPixmap()
        pixmap.loadFromData(QByteArray(img_data))
        
        # Scale to fit preview
        scaled = pixmap.scaled(
            self.image_preview.width() - 20,
            self.image_preview.height() - 20,
            Qt.AspectRatioMode.KeepAspectRatio,
            Qt.TransformationMode.SmoothTransformation
        )
        self.image_preview.setPixmap(scaled)
        
        # Auto-extract text
        self._extract_text()
    
    def _extract_text(self):
        """Extract text from current image"""
        if not self.current_image:
            return
        
        self.status_label.setText("Extracting text...")
        self.status_label.setObjectName("statusWarning")
        QApplication.processEvents()
        
        try:
            self.current_text = self.ocr_engine.extract_text(self.current_image)
            self.text_display.setText(self.current_text)
            
            if self.current_text:
                self.status_label.setText("Text extracted successfully")
                self.status_label.setObjectName("statusSuccess")
            else:
                self.status_label.setText("No text detected")
                self.status_label.setObjectName("statusWarning")
        except Exception as e:
            self.status_label.setText(f"OCR Error: {str(e)}")
            self.status_label.setObjectName("statusError")
    
    def _get_explanation(self):
        """Get AI explanation for current text"""
        if not self.current_text:
            self.explanation_display.setText("Please capture some text first.")
            return
        
        self.status_label.setText("Getting AI explanation...")
        self.status_label.setObjectName("statusWarning")
        self.explanation_display.setText("Thinking...")
        QApplication.processEvents()
        
        try:
            self.current_explanation = self.ai_assistant.get_explanation(self.current_text)
            self.explanation_display.setText(self.current_explanation)
            
            self.status_label.setText("Explanation ready")
            self.status_label.setObjectName("statusSuccess")
            
            # Add to history
            self._add_to_history()
        except Exception as e:
            self.explanation_display.setText(f"Error: {str(e)}")
            self.status_label.setText("Error getting explanation")
            self.status_label.setObjectName("statusError")
    
    def _speak_explanation(self):
        """Read explanation aloud"""
        if self.current_explanation:
            self.tts_engine.speak(self.current_explanation)
            self.status_label.setText("Reading aloud...")
            self.status_label.setObjectName("statusSuccess")
    
    def _stop_speaking(self):
        """Stop text-to-speech"""
        self.tts_engine.stop()
        self.status_label.setText("Stopped reading")
        self.status_label.setObjectName("statusSuccess")
    
    def _copy_text(self):
        """Copy extracted text to clipboard"""
        if self.current_text:
            clipboard = QApplication.clipboard()
            clipboard.setText(self.current_text)
            self.status_label.setText("Text copied to clipboard")
            self.status_label.setObjectName("statusSuccess")
    
    def _copy_explanation(self):
        """Copy explanation to clipboard"""
        if self.current_explanation:
            clipboard = QApplication.clipboard()
            clipboard.setText(self.current_explanation)
            self.status_label.setText("Explanation copied to clipboard")
            self.status_label.setObjectName("statusSuccess")
    
    def _add_to_history(self):
        """Add current capture to history"""
        entry = {
            'timestamp': datetime.now().strftime("%H:%M:%S"),
            'text': self.current_text[:50] + "..." if len(self.current_text) > 50 else self.current_text,
            'full_text': self.current_text,
            'explanation': self.current_explanation,
            'image': self.current_image
        }
        self.history.append(entry)
        
        # Add to list widget
        item = QListWidgetItem(f"📝 {entry['timestamp']}\n{entry['text']}")
        self.history_list.addItem(item)
        self.history_list.scrollToBottom()
    
    def _load_history_item(self, item: QListWidgetItem):
        """Load a history item"""
        index = self.history_list.row(item)
        if 0 <= index < len(self.history):
            entry = self.history[index]
            self.current_text = entry['full_text']
            self.current_explanation = entry['explanation']
            self.current_image = entry['image']
            
            self.text_display.setText(self.current_text)
            self.explanation_display.setText(self.current_explanation)
            
            if self.current_image:
                img_data = self.screen_capture.image_to_bytes(self.current_image)
                pixmap = QPixmap()
                pixmap.loadFromData(QByteArray(img_data))
                scaled = pixmap.scaled(
                    self.image_preview.width() - 20,
                    self.image_preview.height() - 20,
                    Qt.AspectRatioMode.KeepAspectRatio,
                    Qt.TransformationMode.SmoothTransformation
                )
                self.image_preview.setPixmap(scaled)
    
    def _clear_history(self):
        """Clear all history"""
        self.history.clear()
        self.history_list.clear()
        self.status_label.setText("History cleared")
        self.status_label.setObjectName("statusSuccess")
    
    def closeEvent(self, event):
        """Handle window close - hide instead of quit"""
        event.ignore()
        self.hide()
