import json
from typing import Generator, Callable
from openai import OpenAI

from config import get_settings

settings = get_settings()

SYSTEM_PROMPT = """You are an expert document analyst. When given PDF content, produce a structured analysis in the following markdown format exactly:

## Executive Summary
[3-5 sentences summarizing the document's purpose, key findings, and significance]

## Key Topics
- [Topic 1]
- [Topic 2]
- [Topic 3]
[add more as needed]

## Extracted Data & Tables
[List any numerical data points, statistics, dates, or tabular information found in the document. If none, write "No significant data points detected."]

Be concise but thorough. Focus on what matters most to the reader."""


def generate_summary_streaming(
    text: str,
    tables: list,
    on_token: Callable[[str], None],
) -> dict:
    """
    Stream an OpenAI summary token-by-token.
    Calls on_token() for each text delta.
    Returns the final structured dict when done.
    """
    if not settings.openai_api_key or settings.openai_api_key == "your_openai_api_key_here":
        raise ValueError("OPENAI_API_KEY is not set in the .env file. Please add your OpenAI API key to proceed.")

    client = OpenAI(api_key=settings.openai_api_key)

    # Build user message
    text_preview = text[:12000]  # stay within token limits
    tables_str = json.dumps(tables[:10], indent=2) if tables else "No tables detected."

    user_message = f"""Please analyze this PDF document content:

--- DOCUMENT TEXT ---
{text_preview}

--- EXTRACTED TABLES ---
{tables_str}
---

Provide your structured analysis."""

    full_response = ""

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_message},
        ],
        max_tokens=2048,
        stream=True,
    )

    for chunk in response:
        if chunk.choices[0].delta.content:
            text_delta = chunk.choices[0].delta.content
            on_token(text_delta)
            full_response += text_delta

    # Parse the markdown response into structured sections
    structured = _parse_summary_markdown(full_response)
    return structured


def _parse_summary_markdown(md: str) -> dict:
    """Parse the structured markdown response into a dict."""
    sections = {
        "executive_summary": "",
        "key_topics": [],
        "extracted_tables": [],
        "raw": md,
    }

    lines = md.split("\n")
    current_section = None
    buffer = []

    for line in lines:
        stripped = line.strip()
        if stripped.startswith("## Executive Summary"):
            if current_section and buffer:
                _flush_section(sections, current_section, buffer)
            current_section = "executive_summary"
            buffer = []
        elif stripped.startswith("## Key Topics"):
            if current_section and buffer:
                _flush_section(sections, current_section, buffer)
            current_section = "key_topics"
            buffer = []
        elif stripped.startswith("## Extracted Data"):
            if current_section and buffer:
                _flush_section(sections, current_section, buffer)
            current_section = "extracted_tables"
            buffer = []
        elif current_section is not None:
            buffer.append(line)

    if current_section and buffer:
        _flush_section(sections, current_section, buffer)

    return sections


def _flush_section(sections: dict, section: str, buffer: list):
    text = "\n".join(buffer).strip()
    if section == "executive_summary":
        sections["executive_summary"] = text
    elif section == "key_topics":
        topics = [
            line.lstrip("- •*").strip()
            for line in buffer
            if line.strip().startswith(("-", "•", "*"))
        ]
        sections["key_topics"] = [t for t in topics if t]
    elif section == "extracted_tables":
        sections["extracted_tables"] = text
