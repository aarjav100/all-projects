from __future__ import annotations

from pathlib import Path


class AssetManager:
    """Keeps generated asset paths predictable and isolated per campaign."""

    def __init__(self, root: Path) -> None:
        self.root = root

    def campaign_dir(self, campaign_id: str) -> Path:
        path = self.root / campaign_id
        path.mkdir(parents=True, exist_ok=True)
        return path