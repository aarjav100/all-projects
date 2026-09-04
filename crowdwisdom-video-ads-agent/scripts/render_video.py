"""Render an existing storyboard: python scripts/render_video.py outputs/storyboards/ad_01.json."""

from __future__ import annotations

import sys
from pathlib import Path

from app.config import settings
from app.models import Storyboard
from app.tools.json_store import read_json
from app.tools.video_renderer import VideoRenderer


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("Usage: python scripts/render_video.py <storyboard.json>")
    storyboard = read_json(Path(sys.argv[1]), Storyboard)
    path = settings.output_dir / "videos" / f"{storyboard.campaign}.mp4"
    print(VideoRenderer().render(storyboard, path).model_dump_json(indent=2))