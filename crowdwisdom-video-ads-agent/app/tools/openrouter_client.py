"""Compatibility export for the named OpenRouter adapter module."""

from .llm import OpenRouterClient, StructuredLLM

__all__ = ["OpenRouterClient", "StructuredLLM"]