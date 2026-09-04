from __future__ import annotations

from app.agents.base_agent import BaseAgent
from app.models import Storyboard, VideoScript


class StoryboardAgent(BaseAgent[list[VideoScript], list[Storyboard]]):
    role = "Storyboard Agent"

    def execute(self, payload: list[VideoScript]) -> list[Storyboard]:
        return [
            Storyboard(
                campaign=script.concept_id,
                duration_seconds=script.duration_seconds,
                concept=script.title,
                scenes=script.scenes,
                cta=script.cta,
                disclaimer=script.disclaimer,
            )
            for script in payload
        ]