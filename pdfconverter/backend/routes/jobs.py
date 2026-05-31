import json
import asyncio
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse, JSONResponse

from services.redis_client import job_exists, get_job_data, get_tokens

router = APIRouter()


@router.get("/job/{job_id}")
async def get_job_status(job_id: str):
    """Poll job status, progress, and final summary."""
    data = get_job_data(job_id)
    if not data:
        raise HTTPException(404, "Job not found or expired.")

    result = {
        "job_id": job_id,
        "status": data.get("status", "unknown"),
        "progress": int(data.get("progress", 0)),
    }

    if data.get("summary"):
        try:
            result["summary"] = json.loads(data["summary"])
        except Exception:
            result["summary"] = data["summary"]

    if data.get("error"):
        result["error"] = data["error"]

    if data.get("page_count"):
        result["page_count"] = int(data["page_count"])

    if data.get("text_preview"):
        result["text_preview"] = data["text_preview"]

    return result


@router.get("/job/{job_id}/stream")
async def stream_summary(job_id: str):
    """
    Disabled streaming to resolve browser compatibility issues.
    The frontend now polls /job/{job_id} for the final summary.
    """
    return JSONResponse({"status": "streaming_disabled", "message": "Please use status polling."})
