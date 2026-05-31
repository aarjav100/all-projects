import os
import uuid
import time
import shutil
import threading
from pathlib import Path
from config import get_settings

settings = get_settings()


def _ensure_dirs():
    base = Path(settings.storage_dir)
    for sub in ["uploads", "outputs", "temp"]:
        (base / sub).mkdir(parents=True, exist_ok=True)


_ensure_dirs()


def save_upload(data: bytes, suffix: str = ".pdf") -> str:
    """Save uploaded bytes to disk. Returns the file path."""
    path = Path(settings.storage_dir) / "uploads" / f"{uuid.uuid4()}{suffix}"
    path.write_bytes(data)
    _schedule_deletion(str(path))
    return str(path)


def save_output(data: bytes, job_id: str, suffix: str) -> str:
    """Save a converted/edited output file. Returns the file path."""
    path = Path(settings.storage_dir) / "outputs" / f"{job_id}{suffix}"
    path.write_bytes(data)
    _schedule_deletion(str(path))
    return str(path)


def get_download_url(file_path: str) -> str:
    """Return a download URL for a stored file."""
    fname = Path(file_path).name
    return f"{settings.api_base_url}/files/{fname}"


def delete_file(file_path: str):
    try:
        os.remove(file_path)
    except FileNotFoundError:
        pass


def _schedule_deletion(path: str):
    """Schedule file deletion after TTL."""
    ttl_seconds = settings.file_ttl_hours * 3600

    def _delete():
        time.sleep(ttl_seconds)
        delete_file(path)

    t = threading.Thread(target=_delete, daemon=True)
    t.start()


def get_file_path(filename: str) -> str | None:
    """Resolve a filename to a path in any storage subdirectory."""
    base = Path(settings.storage_dir)
    for sub in ["uploads", "outputs", "temp"]:
        p = base / sub / filename
        if p.exists():
            return str(p)
    return None
