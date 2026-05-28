import json
import threading
import asyncio
from contextlib import asynccontextmanager
import redis.asyncio as aioredis

from app.core import config
from app.redis_queues.processor import process_like_post, process_like_comment


try:
    redis_db = aioredis.Redis(
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
            item = await redis_db.blpop(
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
            await asyncio.sleep(config.redis.timeout)


@asynccontextmanager
async def lifespan(app):
    # ---- НА СТАРТЕ ПРИЛОЖЕНИЯ ----
    # asyncio.create_task запускает корутину в фоне ТЕКУЩЕГО лупа FastAPI
    worker_task = asyncio.create_task(run_redis_worker())
    print("Фоновый асинхронный воркер успешно запущен в общем лупе.")

    yield

    # ---- ПРИ ВЫКЛЮЧЕНИИ ПРИЛОЖЕНИЯ ----
    print("Останавливаем воркер...")
    worker_task.cancel()  # Мягко глушим задачу
    try:
        await worker_task
    except asyncio.CancelledError:
        print("Воркер успешно остановлен.")


def run_async_in_thread():
    """Обертка для запуска асинхронной функции в потоке"""
    asyncio.run(run_redis_worker())


def start_redis_worker():
    worker_thread = threading.Thread(target=run_async_in_thread, daemon=True)

    worker_thread.start()
    print("Воркер запущен.")
