import json
from pathlib import Path
from fastapi import APIRouter, HTTPException
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any

from config import get_settings
from services.sanitizer import sanitize_html
from services.redis_client import get_job_data

settings = get_settings()
router = APIRouter()

TEMPLATES_DIR = Path(__file__).parent.parent / "templates"

TEMPLATE_METADATA = [
    {
        "id": "resume",
        "name": "Resume / CV",
        "description": "Clean, professional resume layout with sections for skills and experience.",
        "thumbnail": "resume",
        "tags": ["professional", "cv", "resume"],
    },
    {
        "id": "blog",
        "name": "Article / Blog Post",
        "description": "Readable long-form article layout with typography-focused styling.",
        "thumbnail": "blog",
        "tags": ["article", "blog", "writing"],
    },
    {
        "id": "report",
        "name": "Formal Report",
        "description": "Structured report with table of contents, sections, and data tables.",
        "thumbnail": "report",
        "tags": ["report", "formal", "business"],
    },
    {
        "id": "portfolio",
        "name": "Portfolio",
        "description": "Visual portfolio grid showcasing projects and work samples.",
        "thumbnail": "portfolio",
        "tags": ["portfolio", "creative", "design"],
    },
    {
        "id": "landing",
        "name": "Landing Page",
        "description": "Modern marketing landing page with hero section and call-to-action.",
        "thumbnail": "landing",
        "tags": ["marketing", "landing", "product"],
    },
    {
        "id": "ai-gen",
        "name": "AI Designer (Custom)",
        "description": "Claude analyzes your PDF and builds a unique, custom-tailored webpage.",
        "thumbnail": "sparkles",
        "tags": ["ai", "custom", "dynamic"],
    },
]


@router.get("/templates")
async def list_templates():
    """Return available HTML website templates."""
    return {"templates": TEMPLATE_METADATA}


class ApplyTemplateRequest(BaseModel):
    job_id: str
    template_id: str
    overrides: Optional[Dict[str, Any]] = None


@router.post("/apply-template")
async def apply_template(body: ApplyTemplateRequest):
    """Inject extracted PDF content into a website template."""
    valid_ids = {t["id"] for t in TEMPLATE_METADATA}
    if body.template_id not in valid_ids:
        raise HTTPException(400, f"Unknown template '{body.template_id}'.")

    job_data = get_job_data(body.job_id)
    if not job_data:
        raise HTTPException(404, "Job not found or expired.")

    extracted_text = job_data.get("extracted_text", "No content available.")
    summary_raw = job_data.get("summary", "{}")
    try:
        summary = json.loads(summary_raw)
    except Exception:
        summary = {}

    # Handle AI-generated template
    if body.template_id == "ai-gen":
        from services.template_generator import generate_template_from_pdf
        try:
            html = generate_template_from_pdf(
                extracted_text=extracted_text,
                summary=summary,
                overrides=body.overrides
            )
            return {"html": html, "template_id": body.template_id}
        except Exception as e:
            raise HTTPException(500, f"AI generation failed: {str(e)}")

    template_path = TEMPLATES_DIR / f"{body.template_id}.html"
    if not template_path.exists():
        raise HTTPException(500, f"Template file not found: {body.template_id}.html")

    template_html = template_path.read_text(encoding="utf-8")

    # Build replacement variables
    title = summary.get("title", "Document")
    executive_summary = summary.get("executive_summary", "")
    key_topics = summary.get("key_topics", [])
    topics_html = "\n".join(f"<li>{t}</li>" for t in key_topics)

    # Sanitize extracted text to safe HTML paragraphs
    paragraphs = [p.strip() for p in extracted_text.split("\n\n") if p.strip()]
    content_html = "\n".join(
        f"<p>{sanitize_html(p)}</p>" for p in paragraphs[:50]
    )

    # Apply content injection
    html = template_html
    html = html.replace("{{TITLE}}", sanitize_html(title))
    html = html.replace("{{EXECUTIVE_SUMMARY}}", sanitize_html(executive_summary))
    html = html.replace("{{KEY_TOPICS}}", topics_html)
    html = html.replace("{{CONTENT}}", content_html)

    # Apply style overrides
    if body.overrides:
        primary_color = body.overrides.get("primaryColor", "#6366f1")
        font_family = body.overrides.get("fontFamily", "Inter, sans-serif")
        bg_color = body.overrides.get("bgColor", "#ffffff")
        text_color = body.overrides.get("textColor", "#1f2937")

        style_override = (
            f"<style>:root{{"
            f"--primary:{primary_color};"
            f"--bg:{bg_color};"
            f"--text:{text_color};"
            f"--font:{font_family};"
            f"}}</style>"
        )
        html = html.replace("</head>", f"{style_override}\n</head>")

    return {"html": html, "template_id": body.template_id}
