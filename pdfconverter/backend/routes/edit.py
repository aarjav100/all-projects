from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Literal, Optional

from config import get_settings
from storage import get_download_url
from services.editor import apply_edits
from services.redis_client import get_job_data, set_job_data

settings = get_settings()
router = APIRouter()


class HighlightEdit(BaseModel):
    type: Literal["highlight"]
    page: int
    x: float
    y: float
    width: float
    height: float
    color: Optional[str] = "yellow"


class AnnotationEdit(BaseModel):
    type: Literal["annotate"]
    page: int
    x: float
    y: float
    text: str


class RedactEdit(BaseModel):
    type: Literal["redact"]
    page: int
    x: float
    y: float
    width: float
    height: float


class ReorderEdit(BaseModel):
    type: Literal["reorder"]
    page_order: List[int]  # e.g. [2, 0, 1] for 3-page doc


EditUnion = HighlightEdit | AnnotationEdit | RedactEdit | ReorderEdit


class EditRequest(BaseModel):
    job_id: str
    edits: List[dict]


@router.post("/edit")
async def edit_pdf(body: EditRequest):
    """Apply highlight, annotate, redact, or reorder edits to a PDF."""
    job_data = get_job_data(body.job_id)
    if not job_data:
        raise HTTPException(404, "Job not found or expired.")

    file_path = job_data.get("file_path")
    if not file_path:
        raise HTTPException(500, "File path missing from job data.")

    try:
        output_path = apply_edits(
            file_path=file_path,
            job_id=body.job_id,
            edits=body.edits,
        )
    except Exception as e:
        raise HTTPException(500, f"Edit failed: {str(e)}")

    # Update stored file_path with edited version
    set_job_data(body.job_id, {"file_path": output_path})

    download_url = get_download_url(output_path)
    return {
        "job_id": body.job_id,
        "download_url": download_url,
        "expires_in": settings.file_ttl_hours * 3600,
    }
