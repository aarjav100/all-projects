"""
AI Assistant Module
Integrates with Google Gemini API for explanations and answers
"""

import google.generativeai as genai
from typing import Optional
import config


class AIAssistant:
    """Handles AI-powered explanations using Google Gemini"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or config.GEMINI_API_KEY
        self.model = None
        self.chat = None
        self.last_response = ""
        self._initialize()
    
    def _initialize(self):
        """Initialize the Gemini API"""
        if self.api_key and self.api_key != "YOUR_API_KEY_HERE":
            try:
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel('gemini-pro')
                self.chat = self.model.start_chat(history=[])
            except Exception as e:
                print(f"Failed to initialize Gemini: {e}")
                self.model = None
    
    def is_configured(self) -> bool:
        """Check if the API is properly configured"""
        return self.model is not None
    
    def get_explanation(self, text: str) -> str:
        """
        Get an explanation for the captured text
        
        Args:
            text: The text to explain
        
        Returns:
            AI-generated explanation
        """
        if not self.is_configured():
            return "⚠️ API not configured. Please add your Gemini API key in config.py"
        
        if not text.strip():
            return "No text detected to explain."
        
        prompt = f"""{config.AI_SYSTEM_PROMPT}

Text from screen capture:
\"\"\"
{text}
\"\"\"

Please provide a helpful explanation or guidance."""
        
        try:
            response = self.model.generate_content(prompt)
            self.last_response = response.text
            return self.last_response
        except Exception as e:
            return f"❌ Error getting explanation: {str(e)}"
    
    def suggest_answer(self, question: str) -> str:
        """
        Suggest an answer approach for a question
        
        Args:
            question: The question to help with
        
        Returns:
            AI-generated suggestion
        """
        if not self.is_configured():
            return "⚠️ API not configured. Please add your Gemini API key in config.py"
        
        if not question.strip():
            return "No question detected."
        
        prompt = f"""The user captured this from their screen (likely a practice question or quiz):

\"\"\"
{question}
\"\"\"

Please:
1. Identify what type of question this is
2. Explain the key concepts needed to answer it
3. Give hints on how to approach solving it
4. Do NOT give the direct answer - help them learn!

Be encouraging and educational."""
        
        try:
            response = self.model.generate_content(prompt)
            self.last_response = response.text
            return self.last_response
        except Exception as e:
            return f"❌ Error getting suggestion: {str(e)}"
    
    def ask_followup(self, question: str) -> str:
        """
        Ask a follow-up question in the current conversation
        
        Args:
            question: The follow-up question
        
        Returns:
            AI response
        """
        if not self.is_configured():
            return "⚠️ API not configured."
        
        try:
            response = self.chat.send_message(question)
            self.last_response = response.text
            return self.last_response
        except Exception as e:
            return f"❌ Error: {str(e)}"
    
    def reset_conversation(self):
        """Reset the conversation history"""
        if self.model:
            self.chat = self.model.start_chat(history=[])
