from __future__ import annotations

import importlib
import os
import sys
from dataclasses import dataclass
from typing import Any


@dataclass
class HermesRuntime:
    """Small adapter around Hermes' Python library.

    Hermes is intentionally optional because the upstream project is distributed
    as a source checkout rather than a supported requirements.txt wheel. When it
    is present, agents can call AIAgent.chat(); otherwise the deterministic
    pipeline remains fully runnable and visibly reports the fallback.
    """

    model: str
    available: bool = False
    implementation: str = "deterministic fallback"
    _agent: Any = None

    def __post_init__(self) -> None:
        hermes_path = os.getenv("HERMES_PATH", "")
        if hermes_path and hermes_path not in sys.path:
            sys.path.insert(0, hermes_path)
        try:
            module = importlib.import_module("run_agent")
            agent_class = getattr(module, "AIAgent")
            self._agent = agent_class(model=self.model, quiet_mode=True)
            self.available = True
            self.implementation = "Hermes AIAgent"
        except (ImportError, AttributeError, TypeError):
            self._agent = None

    def chat(self, prompt: str, system_message: str | None = None) -> str:
        if not self._agent:
            raise RuntimeError(
                "Hermes is not installed. Set HERMES_PATH to an upstream checkout."
            )
        if system_message:
            result = self._agent.run_conversation(
                user_message=prompt, system_message=system_message
            )
            return str(result["final_response"])
        return str(self._agent.chat(prompt))