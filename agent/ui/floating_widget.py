"""
Floating Widget Module
Compact always-on-top toolbar for quick access
"""

from PyQt6.QtWidgets import (
    QWidget, QHBoxLayout, QPushButton, QLabel, QSystemTrayIcon, QMenu
)
from PyQt6.QtCore import Qt, QPoint, pyqtSignal
from PyQt6.QtGui import QIcon, QAction, QCursor
import os


class FloatingWidget(QWidget):
    """Compact floating toolbar for quick capture access"""
    
    # Signals
    capture_region_clicked = pyqtSignal()
    capture_fullscreen_clicked = pyqtSignal()
    show_main_window_clicked = pyqtSignal()
    quit_clicked = pyqtSignal()
    
    def __init__(self):
        super().__init__()
        self.drag_pos = None
        self._setup_ui()
        self._setup_tray()
    
    def _setup_ui(self):
        """Setup the floating widget UI"""
        self.setObjectName("FloatingWidget")
        self.setWindowFlags(
            Qt.WindowType.FramelessWindowHint |
            Qt.WindowType.WindowStaysOnTopHint |
            Qt.WindowType.Tool
        )
        self.setAttribute(Qt.WidgetAttribute.WA_TranslucentBackground)
        self.setFixedSize(280, 50)
        
        # Position at top-right of screen
        screen = self.screen()
        if screen:
            screen_geo = screen.availableGeometry()
            self.move(screen_geo.width() - self.width() - 20, 20)
        
        # Layout
        layout = QHBoxLayout(self)
        layout.setContentsMargins(10, 5, 10, 5)
        layout.setSpacing(5)
        
        # Logo/Title
        title = QLabel("🔍")
        title.setStyleSheet("font-size: 20px;")
        layout.addWidget(title)
        
        # Capture Region Button
        self.btn_region = QPushButton("📷")
        self.btn_region.setToolTip("Capture Region (Ctrl+Shift+R)")
        self.btn_region.clicked.connect(self.capture_region_clicked.emit)
        layout.addWidget(self.btn_region)
        
        # Capture Full Screen Button
        self.btn_fullscreen = QPushButton("🖥️")
        self.btn_fullscreen.setToolTip("Capture Full Screen (Ctrl+Shift+F)")
        self.btn_fullscreen.clicked.connect(self.capture_fullscreen_clicked.emit)
        layout.addWidget(self.btn_fullscreen)
        
        # Show Main Window Button
        self.btn_main = QPushButton("📋")
        self.btn_main.setToolTip("Show Main Window")
        self.btn_main.clicked.connect(self.show_main_window_clicked.emit)
        layout.addWidget(self.btn_main)
        
        # Minimize to Tray Button
        self.btn_minimize = QPushButton("➖")
        self.btn_minimize.setToolTip("Minimize to Tray")
        self.btn_minimize.clicked.connect(self.hide)
        layout.addWidget(self.btn_minimize)
        
        # Close Button
        self.btn_close = QPushButton("✕")
        self.btn_close.setToolTip("Quit")
        self.btn_close.setObjectName("dangerBtn")
        self.btn_close.clicked.connect(self.quit_clicked.emit)
        layout.addWidget(self.btn_close)
        
        # Apply styles
        self._apply_styles()
    
    def _apply_styles(self):
        """Apply widget-specific styles"""
        self.setStyleSheet("""
            #FloatingWidget {
                background: rgba(26, 26, 46, 0.95);
                border: 1px solid rgba(99, 102, 241, 0.3);
                border-radius: 25px;
            }
            
            QPushButton {
                background: transparent;
                border: none;
                border-radius: 20px;
                padding: 8px;
                min-width: 35px;
                min-height: 35px;
                font-size: 16px;
            }
            
            QPushButton:hover {
                background: rgba(99, 102, 241, 0.3);
            }
            
            QPushButton#dangerBtn:hover {
                background: rgba(239, 68, 68, 0.3);
            }
            
            QLabel {
                background: transparent;
            }
        """)
    
    def _setup_tray(self):
        """Setup system tray icon"""
        self.tray_icon = QSystemTrayIcon(self)
        
        # Create tray menu
        tray_menu = QMenu()
        
        show_action = QAction("Show Widget", self)
        show_action.triggered.connect(self.show)
        tray_menu.addAction(show_action)
        
        main_action = QAction("Open Main Window", self)
        main_action.triggered.connect(self.show_main_window_clicked.emit)
        tray_menu.addAction(main_action)
        
        tray_menu.addSeparator()
        
        capture_region = QAction("Capture Region", self)
        capture_region.triggered.connect(self.capture_region_clicked.emit)
        tray_menu.addAction(capture_region)
        
        capture_full = QAction("Capture Full Screen", self)
        capture_full.triggered.connect(self.capture_fullscreen_clicked.emit)
        tray_menu.addAction(capture_full)
        
        tray_menu.addSeparator()
        
        quit_action = QAction("Quit", self)
        quit_action.triggered.connect(self.quit_clicked.emit)
        tray_menu.addAction(quit_action)
        
        self.tray_icon.setContextMenu(tray_menu)
        self.tray_icon.setToolTip("AI Screen-Reader Assistant")
        
        # Connect double-click to show widget
        self.tray_icon.activated.connect(self._on_tray_activated)
        
        # Show tray icon
        self.tray_icon.show()
    
    def _on_tray_activated(self, reason):
        """Handle tray icon activation"""
        if reason == QSystemTrayIcon.ActivationReason.DoubleClick:
            self.show()
            self.activateWindow()
    
    def mousePressEvent(self, event):
        """Enable dragging the widget"""
        if event.button() == Qt.MouseButton.LeftButton:
            self.drag_pos = event.globalPosition().toPoint() - self.frameGeometry().topLeft()
            event.accept()
    
    def mouseMoveEvent(self, event):
        """Handle widget dragging"""
        if event.buttons() == Qt.MouseButton.LeftButton and self.drag_pos:
            self.move(event.globalPosition().toPoint() - self.drag_pos)
            event.accept()
    
    def mouseReleaseEvent(self, event):
        """End dragging"""
        self.drag_pos = None
    
    def show_notification(self, title: str, message: str):
        """Show a system notification"""
        self.tray_icon.showMessage(title, message, QSystemTrayIcon.MessageIcon.Information, 3000)
