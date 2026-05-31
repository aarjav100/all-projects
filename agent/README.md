# AI Screen-Reader Assistant 🔍

An AI-powered screen reader that captures text from your screen, extracts it using OCR, and provides helpful explanations using Google Gemini AI.

## Features

- **📷 Region Capture** - Select any area of your screen to analyze
- **🖥️ Full Screen Capture** - Capture your entire screen
- **🔤 OCR Text Extraction** - Automatically extract text from images
- **🤖 AI Explanations** - Get helpful explanations for captured content
- **🔊 Text-to-Speech** - Have explanations read aloud
- **📜 History** - Review past captures and explanations
- **⌨️ Global Hotkeys** - Quick access from anywhere

## Installation

### 1. Install Tesseract OCR

Download and install Tesseract OCR for Windows:
https://github.com/UB-Mannheim/tesseract/wiki

Default installation path: `C:\Program Files\Tesseract-OCR\`

### 2. Get Gemini API Key

1. Go to https://makersuite.google.com/app/apikey
2. Create a free API key
3. Add it to `config.py`:
   ```python
   GEMINI_API_KEY = "your-api-key-here"
   ```

### 3. Install Python Dependencies

```bash
pip install -r requirements.txt
```

## Usage

### Start the App

```bash
python main.py
```

### Hotkeys

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+R` | Capture Region |
| `Ctrl+Shift+F` | Capture Full Screen |
| `Ctrl+Shift+E` | Quick Explain |

### How It Works

1. **Capture** - Press `Ctrl+Shift+R` and draw a rectangle around text/questions
2. **Extract** - Text is automatically extracted using OCR
3. **Explain** - Click "Explain" to get AI-powered guidance
4. **Learn** - The AI helps you understand without giving direct answers

## Configuration

Edit `config.py` to customize:

- `GEMINI_API_KEY` - Your Google Gemini API key
- `TESSERACT_PATH` - Path to Tesseract executable
- `AI_SYSTEM_PROMPT` - How the AI should respond

## Project Structure

```
agent/
├── main.py              # Entry point
├── config.py            # Configuration
├── requirements.txt     # Dependencies
├── core/
│   ├── screen_capture.py  # Screen grabbing
│   ├── ocr_engine.py      # Text extraction
│   ├── ai_assistant.py    # Gemini integration
│   └── tts_engine.py      # Text-to-speech
└── ui/
    ├── main_window.py     # Main UI
    ├── floating_widget.py # Quick access toolbar
    ├── capture_overlay.py # Region selection
    └── styles.qss         # Dark theme
```

## Troubleshooting

**OCR not working?**
- Ensure Tesseract is installed and path is correct in `config.py`

**AI not responding?**
- Check your Gemini API key in `config.py`
- Ensure you have internet connection

**App not starting?**
- Run `pip install -r requirements.txt` again
- Check Python version (3.10+ recommended)

## License

MIT License - Free for personal and educational use.
