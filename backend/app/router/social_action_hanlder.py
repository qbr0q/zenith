import uuid
import json
from fastapi import APIRouter, Request, HTTPException
from starlette.responses import JSONResponse

from app.router.validate.request_schemas import LikeRequest
from app.redis_queues import redis_db
from settings import REDIS_QUEUE


router = APIRouter(prefix='/social_action', tags=["SocialAction"])


@router.post('/like')
async def like(
    data: LikeRequest
):
    if not redis_db:
        raise HTTPException(503, "Очередь обработки недоступна. Попробуйте позже.")
    task_id = str(uuid.uuid4())
    action_group = 'LIKE'
    action = 'REMOVE' if data.is_liked else 'ADD'
    task_payload = {
        "action_group": action_group,
        "action": action,
        "user_id": data.user_id,
        "post_id": data.post_id,
        "task_id": task_id
    }

    try:
        redis_db.rpush(REDIS_QUEUE, json.dumps(task_payload))

        # немедленный ответ фронтенду: 202 Accepted
        return JSONResponse(
            status_code=202,
            content={
                "message": "Запрос на лайк принят в обработку.",
                "taskId": task_id
            }
        )
    except Exception as e:
        print(f"Критическая ошибка при публикации: {e}")
        return HTTPException(500, "Не удалось отправить задачу в очередь.")