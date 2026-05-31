from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Literal

from config import get_settings
from storage import get_download_url
from services.converter import convert_pdf
from services.redis_client import get_job_data

settings = get_settings()
router = APIRouter()

SUPPORTED_FORMATS = {"docx", "ipynb", "html", "md", "txt", "csv", "pptx"}


class ConvertRequest(BaseModel):
    job_id: str
    target_format: str


@router.post("/convert")
async def convert(body: ConvertRequest):
    """Convert uploaded PDF to the specified format."""
    if body.target_format not in SUPPORTED_FORMATS:
        raise HTTPException(
            400,
            f"Unsupported format '{body.target_format}'. "
            f"Supported: {', '.join(sorted(SUPPORTED_FORMATS))}",
        )

    job_data = get_job_data(body.job_id)
    if not job_data:
        raise HTTPException(404, "Job not found or expired.")
    if job_data.get("status") not in ("done", "processing"):
        raise HTTPException(400, f"Job not ready. Current status: {job_data.get('status')}")

    file_path = job_data.get("file_path")
    if not file_path:
        raise HTTPException(500, "File path missing from job data.")

    extracted_text = job_data.get("extracted_text", "")
    tables_json = job_data.get("tables_json", "[]")

    try:
        output_path = convert_pdf(
            file_path=file_path,
            job_id=body.job_id,
            target_format=body.target_format,
            extracted_text=extracted_text,
            tables_json=tables_json,
        )
    except Exception as e:
        raise HTTPException(500, f"Conversion failed: {str(e)}")

    download_url = get_download_url(output_path)
    return {
        "job_id": body.job_id,
        "target_format": body.target_format,
        "download_url": download_url,
        "expires_in": settings.file_ttl_hours * 3600,
    }
