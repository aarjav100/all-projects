from __future__ import annotations

import json
import os
import tempfile
from pathlib import Path
from typing import Any, TypeVar

from pydantic import BaseModel

T = TypeVar("T", bound=BaseModel)


def write_json(path: Path, value: BaseModel | dict[str, Any] | list[Any]) -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    payload = value.model_dump(mode="json") if isinstance(value, BaseModel) else value
    fd, temp_name = tempfile.mkstemp(prefix=f".{path.name}.", dir=path.parent)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as handle:
            json.dump(payload, handle, indent=2, ensure_ascii=False)
            handle.write("\n")
        os.replace(temp_name, path)
    finally:
        if os.path.exists(temp_name):
            os.unlink(temp_name)
    return path


def read_json(path: Path, model: type[T] | None = None) -> Any:
    with path.open("r", encoding="utf-8") as handle:
        payload = json.load(handle)
    return model.model_validate(payload) if model else payload


def cache_path(cache_dir: Path, namespace: str, key: str) -> Path:
    import hashlib

    digest = hashlib.sha256(key.encode("utf-8")).hexdigest()[:16]
    return cache_dir / namespace / f"{digest}.json"