import uuid
from typing import List
import fitz  # PyMuPDF

from storage import save_output

COLOR_MAP = {
    "yellow": (1, 1, 0),
    "green": (0, 1, 0),
    "blue": (0.5, 0.7, 1),
    "pink": (1, 0.6, 0.8),
    "orange": (1, 0.7, 0),
}


def apply_edits(file_path: str, job_id: str, edits: List[dict]) -> str:
    """Apply a list of edits to the PDF and return the new file path."""
    doc = fitz.open(file_path)

    # Separate reorder edits (must be applied last)
    reorder_edit = None
    regular_edits = []
    for edit in edits:
        if edit.get("type") == "reorder":
            reorder_edit = edit
        else:
            regular_edits.append(edit)

    # Apply regular edits
    for edit in regular_edits:
        edit_type = edit.get("type")
        page_num = edit.get("page", 1) - 1  # 0-indexed
        if page_num < 0 or page_num >= len(doc):
            continue

        page = doc[page_num]
        rect = _make_rect(edit)

        if edit_type == "highlight":
            color_name = edit.get("color", "yellow")
            color = COLOR_MAP.get(color_name, (1, 1, 0))
            annot = page.add_highlight_annot(rect)
            annot.set_colors(stroke=color)
            annot.update()

        elif edit_type == "annotate":
            text = edit.get("text", "")
            x = edit.get("x", 0)
            y = edit.get("y", 0)
            annot = page.add_text_annot(fitz.Point(x, y), text)
            annot.update()

        elif edit_type == "redact":
            # Add a redaction annotation (black box)
            page.add_redact_annot(rect, fill=(0, 0, 0))
            page.apply_redactions()

    # Apply page reorder
    if reorder_edit:
        order = reorder_edit.get("page_order", [])
        if order and all(isinstance(i, int) for i in order):
            # Validate indices
            n = len(doc)
            valid_order = [i for i in order if 0 <= i < n]
            if len(valid_order) == n:
                doc.select(valid_order)

    # Save to new path (keep original intact)
    output_id = f"{job_id}_edited"
    buf = doc.tobytes()
    doc.close()
    return save_output(buf, output_id, ".pdf")


def _make_rect(edit: dict) -> fitz.Rect:
    x = float(edit.get("x", 0))
    y = float(edit.get("y", 0))
    w = float(edit.get("width", 100))
    h = float(edit.get("height", 20))
    return fitz.Rect(x, y, x + w, y + h)
