from __future__ import annotations

import logging
import time
from abc import ABC, abstractmethod
from typing import Generic, TypeVar

from app.tools.hermes_runtime import HermesRuntime

InputT = TypeVar("InputT")
OutputT = TypeVar("OutputT")

logger = logging.getLogger("crowdwisdom.agents")


class BaseAgent(ABC, Generic[InputT, OutputT]):
    """Common responsibility, logging, and retry boundary for every agent."""

    role = "agent"

    def __init__(self, retries: int = 2) -> None:
        self.retries = retries
        self.hermes = HermesRuntime("anthropic/claude-3.5-sonnet")

    def run(self, payload: InputT) -> OutputT:
        error: Exception | None = None
        for attempt in range(self.retries + 1):
            try:
                logger.info("%s started (attempt %d)", self.role, attempt + 1)
                result = self.execute(payload)
                logger.info("%s completed", self.role)
                return result
            except Exception as exc:
                error = exc
                logger.warning("%s failed: %s", self.role, exc)
                if attempt < self.retries:
                    time.sleep(0.15 * (attempt + 1))
        raise RuntimeError(f"{self.role} failed after retries") from error

    @abstractmethod
    def execute(self, payload: InputT) -> OutputT:
        raise NotImplementedError