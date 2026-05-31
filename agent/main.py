"""
AI Screen-Reader Assistant
Main entry point
"""

import sys
import os

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from PyQt6.QtWidgets import QApplication
from PyQt6.QtCore import QTimer
from pynput import keyboard

from core import ScreenCapture, OCREngine, AIAssistant, TTSEngine
from ui import MainWindow, FloatingWidget, CaptureOverlay
import config


class ScreenReaderApp:
    """Main application controller"""
    
    def __init__(self):
        self.app = QApplication(sys.argv)
        self.app.setApplicationName("AI Screen-Reader Assistant")
        self.app.setQuitOnLastWindowClosed(False)
        
        # Initialize core components
        self.screen_capture = ScreenCapture()
        self.ocr_engine = OCREngine()
        self.ai_assistant = AIAssistant()
        self.tts_engine = TTSEngine()
        
        # Initialize UI components
        self.main_window = MainWindow(
            self.screen_capture,
            self.ocr_engine,
            self.ai_assistant,
            self.tts_engine
        )
        self.floating_widget = FloatingWidget()
        self.capture_overlay = CaptureOverlay()
        
        # Setup connections
        self._setup_connections()
        
        # Setup global hotkeys
        self._setup_hotkeys()
    
    def _setup_connections(self):
        """Connect signals and slots"""
        # Floating widget signals
        self.floating_widget.capture_region_clicked.connect(self.start_region_capture)
        self.floating_widget.capture_fullscreen_clicked.connect(self.capture_fullscreen)
        self.floating_widget.show_main_window_clicked.connect(self._show_main_window)
        self.floating_widget.quit_clicked.connect(self.quit)
        
        # Main window signals
        self.main_window.request_capture_region.connect(self.start_region_capture)
        self.main_window.request_capture_fullscreen.connect(self.capture_fullscreen)
        
        # Capture overlay signals
        self.capture_overlay.region_selected.connect(self._on_region_selected)
        self.capture_overlay.capture_cancelled.connect(self._on_capture_cancelled)
    
    def _setup_hotkeys(self):
        """Setup global keyboard shortcuts"""
        def on_activate_region():
            # Use QTimer to safely call from another thread
            QTimer.singleShot(0, self.start_region_capture)
        
        def on_activate_fullscreen():
            QTimer.singleShot(0, self.capture_fullscreen)
        
        def on_activate_explain():
            QTimer.singleShot(0, self._quick_explain)
        
        # Parse hotkeys from config
        hotkey_listener = keyboard.GlobalHotKeys({
            '<ctrl>+<shift>+r': on_activate_region,
            '<ctrl>+<shift>+f': on_activate_fullscreen,
            '<ctrl>+<shift>+e': on_activate_explain,
        })
        hotkey_listener.start()
        self.hotkey_listener = hotkey_listener
    
    def start_region_capture(self):
        """Start region selection capture"""
        # Hide windows before capture
        self.main_window.hide()
        self.floating_widget.hide()
        
        # Small delay to let windows hide
        QTimer.singleShot(200, self._show_capture_overlay)
    
    def _show_capture_overlay(self):
        """Show the capture overlay"""
        self.capture_overlay.showFullScreen()
    
    def _on_region_selected(self, x: int, y: int, width: int, height: int):
        """Handle region selection completion"""
        # Capture the selected region
        image = self.screen_capture.capture_region(x, y, width, height)
        
        # Show windows again
        self.floating_widget.show()
        self.main_window.show()
        self.main_window.activateWindow()
        
        # Set captured image
        self.main_window.set_captured_image(image)
        
        # Show notification
        self.floating_widget.show_notification(
            "Capture Complete",
            "Region captured and text extracted!"
        )
    
    def _on_capture_cancelled(self):
        """Handle capture cancellation"""
        self.floating_widget.show()
    
    def capture_fullscreen(self):
        """Capture the full screen"""
        # Hide windows before capture
        was_main_visible = self.main_window.isVisible()
        self.main_window.hide()
        self.floating_widget.hide()
        
        # Small delay to let windows hide
        def do_capture():
            image = self.screen_capture.capture_full_screen()
            
            # Show windows again
            self.floating_widget.show()
            if was_main_visible:
                self.main_window.show()
                self.main_window.activateWindow()
            
            # Set captured image
            self.main_window.set_captured_image(image)
            
            # Show notification
            self.floating_widget.show_notification(
                "Capture Complete",
                "Full screen captured and text extracted!"
            )
        
        QTimer.singleShot(300, do_capture)
    
    def _quick_explain(self):
        """Quick capture and explain"""
        self.start_region_capture()
        # Explanation will be triggered after capture via UI
    
    def _show_main_window(self):
        """Show the main window"""
        self.main_window.show()
        self.main_window.activateWindow()
        self.main_window.raise_()
    
    def quit(self):
        """Quit the application"""
        self.hotkey_listener.stop()
        self.tts_engine.stop()
        self.app.quit()
    
    def run(self):
        """Run the application"""
        # Show floating widget
        self.floating_widget.show()
        
        # Show main window initially
        self.main_window.show()
        
        # Print startup info
        print("=" * 50)
        print("🔍 AI Screen-Reader Assistant")
        print("=" * 50)
        print("\nHotkeys:")
        print("  Ctrl+Shift+R  - Capture Region")
        print("  Ctrl+Shift+F  - Capture Full Screen")
        print("  Ctrl+Shift+E  - Quick Explain")
        print("\nThe floating widget is now visible.")
        print("Close the main window to hide it (app stays in tray).")
        print("=" * 50)
        
        return self.app.exec()


def main():
    """Main entry point"""
    app = ScreenReaderApp()
    sys.exit(app.run())


if __name__ == "__main__":
    main()
