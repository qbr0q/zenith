from fastapi import HTTPException
from functools import wraps
import json

from app.core import config
from app.redis_queues import redis_db


async def push_to_queue(task_payload):
    try:
        await redis_db.rpush(config.redis.action_queue, json.dumps(task_payload))
    except Exception as e:
        print(f"Критическая ошибка при публикации: {e}")
        raise HTTPException(500, "Не удалось отправить задачу в очередь.")


def check_redis_health(handler):
    @wraps(handler)
    async def wrapper(*args, **kwargs):
        if redis_db is None:
            raise HTTPException(status_code=503, detail="Очередь обработки недоступна. Попробуйте позже.")
        return await handler(*args, **kwargs)
    return wrapper
