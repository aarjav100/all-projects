import anthropic
from config import get_settings

settings = get_settings()

GENERATION_SYSTEM = """You are an expert web designer and developer. 
Your task is to generate a single complete, self-contained HTML file that beautifully presents the provided PDF document content.

Rules:
1. Output ONLY valid HTML — no markdown, no code fences, no explanation
2. All CSS must be embedded in a <style> tag inside <head>
3. Use modern design: clean typography, good spacing, a cohesive color palette
4. The page must be responsive and look great on desktop and mobile
5. Include the actual document content — do NOT use placeholder text
6. Structure the page appropriately for the document type (resume, report, article, etc.)
7. Use Google Fonts via a <link> tag for typography
8. The design should feel premium and professional — not generic
9. Include all key content from the document, organized logically
10. Keep it to ~300 lines of HTML — do not include every single word from the PDF"""


def generate_template_from_pdf(
    extracted_text: str,
    summary: dict,
    overrides: dict | None = None,
) -> str:
    """
    Ask Claude to generate a complete HTML page tailored to the PDF content.
    Returns the raw HTML string.
    """
    client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

    title = summary.get("executive_summary", "")[:120] or "Document"
    key_topics = summary.get("key_topics", [])
    exec_summary = summary.get("executive_summary", "")

    # Style preferences from overrides
    primary_color = (overrides or {}).get("primaryColor", "#6366f1")
    font_pref = (overrides or {}).get("fontFamily", "Inter")
    bg_color = (overrides or {}).get("bgColor", "#ffffff")
    text_color = (overrides or {}).get("textColor", "#1f2937")

    # Truncate text to stay within Claude's context window
    text_preview = extracted_text[:10000]

    user_message = f"""Generate a complete, beautiful HTML webpage for this PDF document.

Document Summary:
- Executive Summary: {exec_summary}
- Key Topics: {', '.join(key_topics[:10])}

Style Preferences:
- Primary accent color: {primary_color}
- Background color: {bg_color}
- Text color: {text_color}
- Preferred font: {font_pref}

Full Document Text (first 10,000 characters):
---
{text_preview}
---

Generate the full HTML page now. Output ONLY the HTML, starting with <!DOCTYPE html>."""

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4096,
        system=GENERATION_SYSTEM,
        messages=[{"role": "user", "content": user_message}],
    )

    raw = message.content[0].text.strip()

    # Strip any accidental markdown fences
    if raw.startswith("```"):
        lines = raw.split("\n")
        # Remove first and last fence lines
        start = 1 if lines[0].startswith("```") else 0
        end = len(lines) - 1 if lines[-1].strip() == "```" else len(lines)
        raw = "\n".join(lines[start:end])

    return raw
