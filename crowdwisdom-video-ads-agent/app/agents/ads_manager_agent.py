from __future__ import annotations

from dataclasses import dataclass

from app.agents.base_agent import BaseAgent
from app.models import WorkingAds
from app.tools.research import ApifyClient


@dataclass
class AdsManagerAgent(BaseAgent[bool, WorkingAds]):
    role = "Ads Manager Agent"
    force_refresh: bool = False

    def __post_init__(self) -> None:
        BaseAgent.__init__(self)

    def execute(self, payload: bool) -> WorkingAds:
        return ApifyClient().collect(force_refresh=payload or self.force_refresh)