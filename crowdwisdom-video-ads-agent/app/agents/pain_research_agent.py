from __future__ import annotations

from app.agents.base_agent import BaseAgent
from app.models import PainResearch
from app.tools.research import PainResearchAdapter


class PainResearchAgent(BaseAgent[bool, PainResearch]):
    role = "Pain / ICP Research Agent"

    def execute(self, payload: bool) -> PainResearch:
        return PainResearchAdapter().collect(force_refresh=payload)