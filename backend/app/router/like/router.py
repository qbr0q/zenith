from fastapi import APIRouter, Depends

from app.task_redis.tasks import process_new_like
from app.router.like.shemas import LikeRequest
from app.router.utils import get_current_user_id


router = APIRouter(prefix="/like", tags=["Like"])


@router.post("/")
async def like(
    payload: LikeRequest,
    user_id: int = Depends(get_current_user_id)
):
    data = payload.model_dump()
    data["user_id"] = user_id
    await process_new_like.kiq(payload=data)
