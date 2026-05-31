"""
Screen Capture Module
Handles full-screen and region-based screen captures
"""

import mss
import mss.tools
from PIL import Image
from io import BytesIO


class ScreenCapture:
    """Handles screen capture operations"""
    
    def __init__(self):
        self.sct = mss.mss()
        self.last_capture = None
    
    def capture_full_screen(self, monitor_index: int = 1) -> Image.Image:
        """
        Capture the entire screen
        
        Args:
            monitor_index: Monitor to capture (1 = primary, 0 = all monitors)
        
        Returns:
            PIL Image of the captured screen
        """
        monitor = self.sct.monitors[monitor_index]
        screenshot = self.sct.grab(monitor)
        
        # Convert to PIL Image
        img = Image.frombytes("RGB", screenshot.size, screenshot.bgra, "raw", "BGRX")
        self.last_capture = img
        return img
    
    def capture_region(self, x: int, y: int, width: int, height: int) -> Image.Image:
        """
        Capture a specific region of the screen
        
        Args:
            x: Left coordinate
            y: Top coordinate
            width: Width of region
            height: Height of region
        
        Returns:
            PIL Image of the captured region
        """
        region = {
            "left": x,
            "top": y,
            "width": width,
            "height": height
        }
        screenshot = self.sct.grab(region)
        
        # Convert to PIL Image
        img = Image.frombytes("RGB", screenshot.size, screenshot.bgra, "raw", "BGRX")
        self.last_capture = img
        return img
    
    def get_monitors(self) -> list:
        """Get list of available monitors"""
        return self.sct.monitors[1:]  # Skip the 'all monitors' entry
    
    def save_capture(self, image: Image.Image, filepath: str) -> None:
        """Save captured image to file"""
        image.save(filepath)
    
    def image_to_bytes(self, image: Image.Image) -> bytes:
        """Convert PIL Image to bytes for display in Qt"""
        buffer = BytesIO()
        image.save(buffer, format="PNG")
        return buffer.getvalue()
