import uuid
from fastapi import APIRouter, Depends

from app.redis_queues.utils import push_to_queue, check_redis_health
from app.router.like.shemas import LikeRequest
from app.router.utils import get_current_user_id


router = APIRouter(prefix="/like", tags=["Like"])


@router.post("/")
@check_redis_health
async def like(
    data: LikeRequest,
    user_id: int = Depends(get_current_user_id)
):
    task_id = str(uuid.uuid4())
    action_group = f"LIKE_{data.type.upper()}"
    task_payload = {
        "action_group": action_group,
        "user_id": user_id,
        "post_id": data.post_id,
        "comment_id": data.post_id,
        "task_id": task_id,
        "type": data.type
    }

    await push_to_queue(task_payload)
