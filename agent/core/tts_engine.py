"""
Text-to-Speech Engine Module
Provides text-to-speech functionality for accessibility
"""

import pyttsx3
import threading
from typing import Optional


class TTSEngine:
    """Handles text-to-speech operations"""
    
    def __init__(self):
        self.engine = None
        self.is_speaking = False
        self._lock = threading.Lock()
        self._initialize()
    
    def _initialize(self):
        """Initialize the TTS engine"""
        try:
            self.engine = pyttsx3.init()
            
            # Set default properties
            self.engine.setProperty('rate', 175)  # Speed
            self.engine.setProperty('volume', 0.9)  # Volume (0.0 to 1.0)
            
            # Get available voices
            voices = self.engine.getProperty('voices')
            if voices:
                # Try to use a female voice if available
                for voice in voices:
                    if 'female' in voice.name.lower() or 'zira' in voice.name.lower():
                        self.engine.setProperty('voice', voice.id)
                        break
        except Exception as e:
            print(f"Failed to initialize TTS: {e}")
            self.engine = None
    
    def speak(self, text: str, block: bool = False) -> None:
        """
        Speak the given text
        
        Args:
            text: Text to speak
            block: If True, wait for speech to complete
        """
        if not self.engine:
            print("TTS engine not available")
            return
        
        if not text.strip():
            return
        
        def _speak():
            with self._lock:
                self.is_speaking = True
                try:
                    self.engine.say(text)
                    self.engine.runAndWait()
                finally:
                    self.is_speaking = False
        
        if block:
            _speak()
        else:
            thread = threading.Thread(target=_speak, daemon=True)
            thread.start()
    
    def stop(self) -> None:
        """Stop current speech"""
        if self.engine and self.is_speaking:
            try:
                self.engine.stop()
                self.is_speaking = False
            except Exception:
                pass
    
    def set_rate(self, rate: int) -> None:
        """
        Set speech rate
        
        Args:
            rate: Words per minute (default is around 175)
        """
        if self.engine:
            self.engine.setProperty('rate', rate)
    
    def set_volume(self, volume: float) -> None:
        """
        Set speech volume
        
        Args:
            volume: Volume level from 0.0 to 1.0
        """
        if self.engine:
            self.engine.setProperty('volume', max(0.0, min(1.0, volume)))
    
    def get_voices(self) -> list:
        """Get list of available voices"""
        if self.engine:
            return self.engine.getProperty('voices')
        return []
    
    def set_voice(self, voice_id: str) -> None:
        """Set the voice by ID"""
        if self.engine:
            self.engine.setProperty('voice', voice_id)
    
    def is_available(self) -> bool:
        """Check if TTS is available"""
        return self.engine is not None
