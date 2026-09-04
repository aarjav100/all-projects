from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv

ROOT_DIR = Path(__file__).resolve().parents[1]
load_dotenv(ROOT_DIR / ".env")


class Settings:
    """Runtime settings with safe defaults for a credential-free demo."""

    def __init__(self) -> None:
        self.root_dir = ROOT_DIR
        self.data_dir = ROOT_DIR / "data"
        self.output_dir = ROOT_DIR / "outputs"
        self.cache_dir = self.data_dir / "cache"
        self.proprietary_dir = self.data_dir / "proprietary"
        self.openrouter_api_key = os.getenv("OPENROUTER_API_KEY", "")
        self.openrouter_model = os.getenv(
            "OPENROUTER_MODEL", "anthropic/claude-3.5-sonnet"
        )
        self.apify_api_token = os.getenv("APIFY_API_TOKEN", "")
        self.tavily_api_key = os.getenv("TAVILY_API_KEY", "")
        self.exa_api_key = os.getenv("EXA_API_KEY", "")
        self.hermes_path = os.getenv("HERMES_PATH", "")
        self.lookback_days = int(os.getenv("RESEARCH_LOOKBACK_DAYS", "30"))
        self.video_width = int(os.getenv("VIDEO_WIDTH", "720"))
        self.video_height = int(os.getenv("VIDEO_HEIGHT", "1280"))
        self.video_fps = int(os.getenv("VIDEO_FPS", "30"))

    def ensure_directories(self) -> None:
        for path in (
            self.data_dir / "raw",
            self.data_dir / "competitor_ads",
            self.data_dir / "research",
            self.data_dir / "analyzed",
            self.data_dir / "generated",
            self.cache_dir,
            self.output_dir / "research",
            self.output_dir / "scripts",
            self.output_dir / "storyboards",
            self.output_dir / "videos",
            self.output_dir / "reports",
            self.output_dir / "qa",
            self.output_dir / "assets",
        ):
            path.mkdir(parents=True, exist_ok=True)

    @property
    def has_live_research_credentials(self) -> bool:
        return bool(self.apify_api_token or self.tavily_api_key or self.exa_api_key)


settings = Settings()