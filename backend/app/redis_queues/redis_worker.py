import json
import time
import threading
import asyncio
import redis

from app.core import config
from app.redis_queues.processor import process_like_post, process_like_comment


try:
    redis_db = redis.Redis(
        host=config.redis.host,
        port=config.redis.port,
        db=0
    )
    redis_db.ping()
    print("Успешное подключение к Redis.")
except redis.exceptions.ConnectionError as e:
    print(f"Ошибка подключения к Redis. Сервер не сможет публиковать задачи.")
    redis_db = None


async def run_redis_worker():
    if not redis_db:
        return None
    while True:
        try:
            item = redis_db.blpop(
                config.redis.action_queue, timeout=config.redis.timeout
            )
            if item:
                message = item[1]
                task_data = json.loads(message)
                action_group = task_data.get('action_group')
                if action_group == 'LIKE_POST':
                    await process_like_post(task_data)
                elif action_group == 'LIKE_COMMENT':
                    await process_like_comment(task_data)

        except Exception as e:
            print(f"Критическая ошибка воркера: {e}.")
            time.sleep(config.redis.timeout)


def run_async_in_thread():
    """Обертка для запуска асинхронной функции в потоке"""
    asyncio.run(run_redis_worker())


def start_redis_worker():
    worker_thread = threading.Thread(target=run_async_in_thread, daemon=True)

    worker_thread.start()
    print("Воркер запущен.")
