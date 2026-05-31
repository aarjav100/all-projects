import json
from typing import Any
import fitz  # PyMuPDF
import pdfplumber


def extract_text(file_path: str) -> str:
    """Extract all text from a PDF using PyMuPDF."""
    doc = fitz.open(file_path)
    pages_text = []
    for page in doc:
        text = page.get_text("text")
        pages_text.append(text)
    doc.close()
    return "\n\n".join(pages_text)


def extract_page_count(file_path: str) -> int:
    doc = fitz.open(file_path)
    count = len(doc)
    doc.close()
    return count


def extract_tables(file_path: str) -> list[dict[str, Any]]:
    """Extract tables from a PDF using pdfplumber."""
    tables = []
    with pdfplumber.open(file_path) as pdf:
        for i, page in enumerate(pdf.pages):
            raw_tables = page.extract_tables()
            for j, table in enumerate(raw_tables):
                if not table:
                    continue
                # First row as headers if it looks like one
                headers = table[0] if table else []
                rows = table[1:] if len(table) > 1 else []
                tables.append({
                    "page": i + 1,
                    "table_index": j,
                    "title": f"Table {len(tables) + 1} (Page {i + 1})",
                    "headers": [str(h or "") for h in headers],
                    "rows": [[str(cell or "") for cell in row] for row in rows],
                })
    return tables


def extract_images_info(file_path: str) -> list[dict]:
    """Return metadata about embedded images (no extraction, just info)."""
    doc = fitz.open(file_path)
    images = []
    for page_num, page in enumerate(doc):
        img_list = page.get_images(full=True)
        for img in img_list:
            images.append({
                "page": page_num + 1,
                "xref": img[0],
                "width": img[2],
                "height": img[3],
                "colorspace": img[5],
            })
    doc.close()
    return images


def get_text_preview(text: str, max_chars: int = 500) -> str:
    preview = text[:max_chars].strip()
    if len(text) > max_chars:
        preview += "..."
    return preview
