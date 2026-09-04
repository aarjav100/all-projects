from __future__ import annotations

from pathlib import Path

from app.agents.base_agent import BaseAgent
from app.config import settings
from app.models import Storyboard, VideoMetadata
from app.tools.video_renderer import VideoRenderer


class VideoAgent(BaseAgent[list[Storyboard], list[VideoMetadata]]):
    role = "Video Director / Renderer Agent"

    def execute(self, payload: list[Storyboard]) -> list[VideoMetadata]:
        renderer = VideoRenderer()
        results = []
        for storyboard in payload:
            results.append(
                renderer.render(
                    storyboard,
                    settings.output_dir / "videos" / f"{storyboard.campaign}.mp4",
                )
            )
        return results