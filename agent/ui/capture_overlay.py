"""
Capture Overlay Module
Full-screen transparent overlay for region selection
"""

from PyQt6.QtWidgets import QWidget, QApplication
from PyQt6.QtCore import Qt, QRect, QPoint, pyqtSignal
from PyQt6.QtGui import QPainter, QColor, QPen, QCursor


class CaptureOverlay(QWidget):
    """Full-screen overlay for selecting a region to capture"""
    
    # Signal emitted when a region is selected (x, y, width, height)
    region_selected = pyqtSignal(int, int, int, int)
    capture_cancelled = pyqtSignal()
    
    def __init__(self):
        super().__init__()
        self.start_pos = None
        self.end_pos = None
        self.is_selecting = False
        self._setup_ui()
    
    def _setup_ui(self):
        """Setup the overlay UI"""
        # Make it fullscreen and transparent
        self.setWindowFlags(
            Qt.WindowType.FramelessWindowHint |
            Qt.WindowType.WindowStaysOnTopHint |
            Qt.WindowType.Tool
        )
        self.setAttribute(Qt.WidgetAttribute.WA_TranslucentBackground)
        self.setMouseTracking(True)
        self.setCursor(QCursor(Qt.CursorShape.CrossCursor))
        
        # Get full screen geometry (all monitors)
        screen = QApplication.primaryScreen()
        if screen:
            geometry = screen.virtualGeometry()
            self.setGeometry(geometry)
    
    def showEvent(self, event):
        """Reset state when shown"""
        self.start_pos = None
        self.end_pos = None
        self.is_selecting = False
        
        # Update geometry to cover all screens
        screen = QApplication.primaryScreen()
        if screen:
            geometry = screen.virtualGeometry()
            self.setGeometry(geometry)
        
        super().showEvent(event)
    
    def paintEvent(self, event):
        """Paint the overlay with selection rectangle"""
        painter = QPainter(self)
        
        # Semi-transparent dark overlay
        painter.fillRect(self.rect(), QColor(0, 0, 0, 120))
        
        # Draw selection rectangle if selecting
        if self.start_pos and self.end_pos:
            # Get the selection rectangle
            rect = self._get_selection_rect()
            
            # Clear the selection area (make it transparent)
            painter.setCompositionMode(QPainter.CompositionMode.CompositionMode_Clear)
            painter.fillRect(rect, Qt.GlobalColor.transparent)
            
            # Draw border around selection
            painter.setCompositionMode(QPainter.CompositionMode.CompositionMode_SourceOver)
            pen = QPen(QColor(99, 102, 241), 2)  # Indigo border
            painter.setPen(pen)
            painter.drawRect(rect)
            
            # Draw corner handles
            handle_size = 8
            handle_color = QColor(99, 102, 241)
            painter.fillRect(rect.left() - handle_size//2, rect.top() - handle_size//2, handle_size, handle_size, handle_color)
            painter.fillRect(rect.right() - handle_size//2, rect.top() - handle_size//2, handle_size, handle_size, handle_color)
            painter.fillRect(rect.left() - handle_size//2, rect.bottom() - handle_size//2, handle_size, handle_size, handle_color)
            painter.fillRect(rect.right() - handle_size//2, rect.bottom() - handle_size//2, handle_size, handle_size, handle_color)
            
            # Draw dimensions
            if rect.width() > 50 and rect.height() > 30:
                dim_text = f"{rect.width()} × {rect.height()}"
                painter.setPen(QColor(255, 255, 255))
                painter.drawText(rect.center().x() - 30, rect.center().y(), dim_text)
        
        # Draw instructions at top
        painter.setPen(QColor(255, 255, 255))
        painter.drawText(20, 30, "Click and drag to select a region. Press ESC to cancel.")
    
    def _get_selection_rect(self) -> QRect:
        """Get normalized selection rectangle"""
        if not self.start_pos or not self.end_pos:
            return QRect()
        
        x1, y1 = self.start_pos.x(), self.start_pos.y()
        x2, y2 = self.end_pos.x(), self.end_pos.y()
        
        return QRect(
            min(x1, x2), min(y1, y2),
            abs(x2 - x1), abs(y2 - y1)
        )
    
    def mousePressEvent(self, event):
        """Start selection on mouse press"""
        if event.button() == Qt.MouseButton.LeftButton:
            self.start_pos = event.pos()
            self.end_pos = event.pos()
            self.is_selecting = True
            self.update()
    
    def mouseMoveEvent(self, event):
        """Update selection on mouse move"""
        if self.is_selecting:
            self.end_pos = event.pos()
            self.update()
    
    def mouseReleaseEvent(self, event):
        """Complete selection on mouse release"""
        if event.button() == Qt.MouseButton.LeftButton and self.is_selecting:
            self.is_selecting = False
            self.end_pos = event.pos()
            
            rect = self._get_selection_rect()
            
            # Only emit if selection is meaningful (at least 10x10)
            if rect.width() >= 10 and rect.height() >= 10:
                # Adjust for screen position
                global_pos = self.mapToGlobal(QPoint(rect.x(), rect.y()))
                self.region_selected.emit(
                    global_pos.x(),
                    global_pos.y(),
                    rect.width(),
                    rect.height()
                )
            
            self.hide()
    
    def keyPressEvent(self, event):
        """Handle key presses"""
        if event.key() == Qt.Key.Key_Escape:
            self.capture_cancelled.emit()
            self.hide()
