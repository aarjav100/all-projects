import redis as redis_lib
from config import get_settings

settings = get_settings()

try:
    # Temporarily disabling Redis to fix 500 errors and simplify the app
    # redis_client = redis_lib.from_url(settings.redis_url, decode_responses=True)
    # redis_client.ping()
    # HAS_REDIS = True
    redis_client = None
    HAS_REDIS = False
    print("INFO: Redis disabled for stability. Using local in-memory fallback.")
except Exception:
    redis_client = None
    HAS_REDIS = False

# Shared in-memory store for when Redis is unavailable
_local_jobs = {}
_local_tokens = {} # job_id -> list of tokens for streaming

def get_job_data(job_id: str):
    if HAS_REDIS:
        return redis_client.hgetall(f"job:{job_id}")
    return _local_jobs.get(job_id, {})

def set_job_data(job_id: str, mapping: dict):
    if HAS_REDIS:
        # Use hset for compatibility with modern redis-py
        redis_client.hset(f"job:{job_id}", mapping=mapping)
        redis_client.expire(f"job:{job_id}", settings.file_ttl_hours * 3600)
    else:
        if job_id not in _local_jobs:
            _local_jobs[job_id] = {}
        _local_jobs[job_id].update(mapping)

def push_token(job_id: str, token: str):
    if HAS_REDIS:
        redis_client.rpush(f"job:{job_id}:tokens", token)
    else:
        if job_id not in _local_tokens:
            _local_tokens[job_id] = []
        _local_tokens[job_id].append(token)

def get_tokens(job_id: str, start: int):
    if HAS_REDIS:
        return redis_client.lrange(f"job:{job_id}:tokens", start, -1)
    tokens = _local_tokens.get(job_id, [])
    return tokens[start:]

def job_exists(job_id: str):
    if HAS_REDIS:
        return redis_client.exists(f"job:{job_id}")
    return job_id in _local_jobs
