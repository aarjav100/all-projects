from __future__ import annotations

import json
import time
import urllib.error
import urllib.request
from typing import Any

from pydantic import BaseModel

from app.config import settings
from app.tools.hermes_runtime import HermesRuntime


class OpenRouterClient:
    def __init__(self) -> None:
        self.endpoint = "https://openrouter.ai/api/v1/chat/completions"

    def complete(self, messages: list[dict[str, str]], temperature: float = 0.4) -> str:
        if not settings.openrouter_api_key:
            raise RuntimeError("OPENROUTER_API_KEY is not configured")
        body = json.dumps(
            {
                "model": settings.openrouter_model,
                "messages": messages,
                "temperature": temperature,
                "response_format": {"type": "json_object"},
            }
        ).encode("utf-8")
        request = urllib.request.Request(
            self.endpoint,
            data=body,
            headers={
                "Authorization": f"Bearer {settings.openrouter_api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://www.crowdwisdomtrading.com/",
                "X-Title": "CrowdWisdom Video Ads Agent",
            },
            method="POST",
        )
        with urllib.request.urlopen(request, timeout=90) as response:
            payload = json.loads(response.read().decode("utf-8"))
        return str(payload["choices"][0]["message"]["content"])


class StructuredLLM:
    """Uses Hermes when configured, then OpenRouter, with JSON repair retries."""

    def __init__(self) -> None:
        self.hermes = HermesRuntime(settings.openrouter_model)
        self.openrouter = OpenRouterClient()

    def generate(self, prompt: str, schema: type[BaseModel]) -> BaseModel:
        raw = ""
        for attempt in range(3):
            try:
                if self.hermes.available:
                    raw = self.hermes.chat(prompt)
                else:
                    raw = self.openrouter.complete(
                        [
                            {
                                "role": "system",
                                "content": "Return only valid JSON matching the requested schema.",
                            },
                            {"role": "user", "content": prompt},
                        ]
                    )
                return schema.model_validate(json.loads(self._extract_json(raw)))
            except (json.JSONDecodeError, KeyError, TypeError, ValueError) as exc:
                if attempt == 2:
                    raise ValueError(f"Structured response failed validation: {exc}") from exc
                time.sleep(0.4 * (attempt + 1))
            except (urllib.error.URLError, TimeoutError) as exc:
                raise RuntimeError(f"LLM provider request failed: {exc}") from exc
        raise RuntimeError("Unreachable structured generation state")

    @staticmethod
    def _extract_json(raw: str) -> str:
        start = raw.find("{")
        end = raw.rfind("}")
        if start < 0 or end <= start:
            raise ValueError("No JSON object found in provider response")
        return raw[start : end + 1]