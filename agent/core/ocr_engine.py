"""
OCR Engine Module
Extracts text from images using Tesseract OCR
"""

import pytesseract
from PIL import Image, ImageEnhance, ImageFilter
import config


# Set Tesseract path
pytesseract.pytesseract.tesseract_cmd = config.TESSERACT_PATH


class OCREngine:
    """Handles text extraction from images using Tesseract OCR"""
    
    def __init__(self):
        self.last_text = ""
    
    def preprocess_image(self, image: Image.Image) -> Image.Image:
        """
        Preprocess image for better OCR accuracy
        
        Args:
            image: PIL Image to preprocess
        
        Returns:
            Preprocessed PIL Image
        """
        # Convert to grayscale
        img = image.convert("L")
        
        # Enhance contrast
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(2.0)
        
        # Sharpen
        img = img.filter(ImageFilter.SHARPEN)
        
        # Scale up for better recognition (if small)
        width, height = img.size
        if width < 500 or height < 100:
            scale_factor = max(500 / width, 100 / height, 2)
            new_size = (int(width * scale_factor), int(height * scale_factor))
            img = img.resize(new_size, Image.Resampling.LANCZOS)
        
        return img
    
    def extract_text(self, image: Image.Image, preprocess: bool = True) -> str:
        """
        Extract text from an image using OCR
        
        Args:
            image: PIL Image to extract text from
            preprocess: Whether to preprocess the image first
        
        Returns:
            Extracted text as string
        """
        if preprocess:
            img = self.preprocess_image(image)
        else:
            img = image
        
        # Configure Tesseract for best results
        custom_config = r'--oem 3 --psm 6'
        
        try:
            text = pytesseract.image_to_string(img, config=custom_config)
            self.last_text = text.strip()
            return self.last_text
        except Exception as e:
            return f"OCR Error: {str(e)}"
    
    def extract_text_with_confidence(self, image: Image.Image) -> dict:
        """
        Extract text with confidence scores
        
        Returns:
            Dictionary with text and confidence data
        """
        img = self.preprocess_image(image)
        
        try:
            data = pytesseract.image_to_data(img, output_type=pytesseract.Output.DICT)
            
            words = []
            for i, word in enumerate(data['text']):
                if word.strip():
                    words.append({
                        'text': word,
                        'confidence': data['conf'][i],
                        'x': data['left'][i],
                        'y': data['top'][i]
                    })
            
            full_text = ' '.join([w['text'] for w in words])
            avg_confidence = sum([w['confidence'] for w in words]) / len(words) if words else 0
            
            return {
                'text': full_text,
                'words': words,
                'average_confidence': avg_confidence
            }
        except Exception as e:
            return {
                'text': f"OCR Error: {str(e)}",
                'words': [],
                'average_confidence': 0
            }
    
    def is_tesseract_installed(self) -> bool:
        """Check if Tesseract is properly installed"""
        try:
            pytesseract.get_tesseract_version()
            return True
        except Exception:
            return False
