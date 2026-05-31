from pydantic_settings import BaseSettings
from functools import lru_cache
import os


class Settings(BaseSettings):
    anthropic_api_key: str = ""
    openai_api_key: str = ""
    redis_url: str = "redis://localhost:6379/0"
    storage_dir: str = "./storage"
    max_file_size_mb: int = 50
    file_ttl_hours: int = 1
    api_base_url: str = "http://localhost:8000"
    allowed_origins: str = "http://localhost:5173,http://localhost:3000"

    @property
    def max_file_size_bytes(self) -> int:
        return self.max_file_size_mb * 1024 * 1024

    @property
    def origins_list(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",")]

    model_config = {"env_file": ".env", "extra": "ignore"}


@lru_cache()
def get_settings() -> Settings:
    return Settings()
