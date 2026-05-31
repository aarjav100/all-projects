import uuid
import httpx
from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Optional
import json

from config import get_settings
from storage import save_upload, get_download_url
from services.redis_client import HAS_REDIS, set_job_data

settings = get_settings()
router = APIRouter()

PDF_MAGIC = b"%PDF"


def _validate_pdf_bytes(data: bytes) -> bool:
    return data[:4] == PDF_MAGIC


def _init_job(job_id: str, file_path: str):
    set_job_data(job_id, {
        "status": "pending",
        "progress": "0",
        "file_path": file_path,
    })


class UrlUploadRequest(BaseModel):
    url: str


@router.post("/upload")
async def upload_pdf(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
):
    """Upload a PDF file. Returns job_id for status polling."""
    # Read file data
    data = await file.read()

    # Size check
    if len(data) > settings.max_file_size_bytes:
        raise HTTPException(413, f"File exceeds {settings.max_file_size_mb} MB limit.")

    # Magic byte validation
    if not _validate_pdf_bytes(data):
        raise HTTPException(415, "Uploaded file is not a valid PDF (magic byte check failed).")

    # Save to disk
    file_path = save_upload(data, suffix=".pdf")
    file_url = get_download_url(file_path)

    # Create job
    job_id = str(uuid.uuid4())
    _init_job(job_id, file_path)

    # Dispatch task
    from tasks.jobs import process_pdf_job
    if HAS_REDIS:
        process_pdf_job.delay(job_id, file_path)
    else:
        background_tasks.add_task(process_pdf_job, job_id, file_path)

    return {"job_id": job_id, "status": "pending", "file_url": file_url}


@router.post("/upload/url")
async def upload_pdf_from_url(body: UrlUploadRequest, background_tasks: BackgroundTasks):
    """Fetch a remote PDF by URL and process it."""
    try:
        async with httpx.AsyncClient(timeout=30, follow_redirects=True) as client:
            response = await client.get(body.url)
            response.raise_for_status()
    except httpx.HTTPError as e:
        raise HTTPException(400, f"Failed to fetch URL: {str(e)}")

    data = response.content

    if len(data) > settings.max_file_size_bytes:
        raise HTTPException(413, f"Remote file exceeds {settings.max_file_size_mb} MB limit.")

    if not _validate_pdf_bytes(data):
        raise HTTPException(415, "Remote file is not a valid PDF.")

    file_path = save_upload(data, suffix=".pdf")
    file_url = get_download_url(file_path)
    job_id = str(uuid.uuid4())
    _init_job(job_id, file_path)

    from tasks.jobs import process_pdf_job
    if HAS_REDIS:
        process_pdf_job.delay(job_id, file_path)
    else:
        background_tasks.add_task(process_pdf_job, job_id, file_path)

    return {"job_id": job_id, "status": "pending", "file_url": file_url}
