from __future__ import annotations

from pathlib import Path

from app.agents.base_agent import BaseAgent
from app.models import ProprietaryInsights
from app.tools.data_loader import ProprietaryDataLoader


class ProprietaryDataAgent(BaseAgent[Path, ProprietaryInsights]):
    role = "Proprietary Data Analysis Agent"

    def execute(self, payload: Path) -> ProprietaryInsights:
        return ProprietaryDataLoader().inspect(payload)