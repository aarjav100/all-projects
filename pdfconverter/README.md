# PDF Studio

A full-stack PDF processing web app with AI summaries, format conversion, in-browser editing, and website templates.

## Tech Stack
- **Frontend**: React + TypeScript + Tailwind CSS v4 + Vite
- **Backend**: FastAPI + Celery + Redis
- **AI**: Anthropic Claude claude-sonnet-4-20250514 (streaming via SSE)
- **PDF**: PyMuPDF (fitz) + pdfplumber

## Prerequisites
- Python 3.11+
- Node.js 18+
- Redis (native install)
- Pandoc (optional, for some conversions)

## Quick Start

### 1. Start Redis
Make sure your local Redis server is running on the default port `6379`.


### 2. Backend setup
```bash
cd backend
pip install -r requirements.txt
# Edit .env and add your ANTHROPIC_API_KEY
uvicorn main:app --reload --port 8000
```

### 3. Start Celery worker (separate terminal)
```bash
cd backend
celery -A celery_app worker --loglevel=info --pool=solo
```

### 4. Frontend
```bash
cd frontend
npm run dev
```

Open http://localhost:5173

## API Routes
| Method | Path | Description |
|--------|------|-------------|
| POST | /upload | Upload PDF file |
| POST | /upload/url | Fetch PDF from URL |
| GET | /job/{id} | Poll job status |
| GET | /job/{id}/stream | SSE token stream |
| POST | /convert | Convert to format |
| POST | /edit | Apply edits |
| GET | /templates | List templates |
| POST | /apply-template | Inject content into template |
| GET | /files/{filename} | Download output file |
