import redis
import json
import threading

from settings import REDIS_HOST, REDIS_PORT, REDIS_QUEUE, BLOCK_TIMEOUT
from .utils import process_like_task


try:
    redis_db = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=0)
    redis_db.ping()
    print("Успешное подключение к Redis.")
except redis.exceptions.ConnectionError as e:
    print(f"Ошибка подключения к Redis. Сервер не сможет публиковать задачи.")
    redis_db = None


def run_redis_worker():
    if not redis_db:
        return None
    while True:
        try:
            item = redis_db.blpop(REDIS_QUEUE, timeout=BLOCK_TIMEOUT)
            if item:
                message = item[1]
                task_data = json.loads(message)
                action_group = task_data.get('action_group')
                if action_group == 'LIKE':
                    process_like_task(task_data)

        except Exception as e:
            print(f"Критическая ошибка воркера: {e}.")


def start_worker_thread():
    print("Запуск воркера Redis в отдельном потоке...")

    worker_thread = threading.Thread(target=run_redis_worker, daemon=True)

    worker_thread.start()
    print("Воркер запущен.")
