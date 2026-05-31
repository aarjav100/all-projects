import json
from celery_app import celery_app
from config import get_settings
from services.pdf_parser import (
    extract_text,
    extract_tables,
    extract_page_count,
    get_text_preview,
)
from services.ai_summary import generate_summary_streaming
from services.redis_client import set_job_data, push_token

settings = get_settings()

@celery_app.task(bind=True, name="tasks.jobs.process_pdf_job")
def process_pdf_job(self, job_id: str, file_path: str):
    """
    Main background job:
    1. Extract text and tables from PDF
    2. Stream Claude summary tokens
    3. Save structured summary
    """
    def _update(status: str, progress: int, **extra):
        set_job_data(job_id, {"status": status, "progress": str(progress), **extra})

    try:
        # Step 1: Parse PDF
        _update("processing", 10)
        page_count = extract_page_count(file_path)
        _update("processing", 20, page_count=str(page_count))

        text = extract_text(file_path)
        _update("processing", 40, extracted_text=text[:50000])  # store up to 50k chars

        tables = extract_tables(file_path)
        tables_json = json.dumps(tables)
        preview = get_text_preview(text)
        _update("processing", 60, tables_json=tables_json, text_preview=preview)

        # Step 2: Stream AI summary
        _update("processing", 65)

        def _push_token_callback(token: str):
            push_token(job_id, token)

        summary = generate_summary_streaming(text, tables, on_token=_push_token_callback)

        # Step 3: Save final summary
        _update(
            "done",
            100,
            summary=json.dumps(summary),
        )

    except Exception as exc:
        _update("error", 0, error=str(exc))
        raise
