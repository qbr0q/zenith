import uuid
import json
from fastapi import APIRouter, Request, HTTPException, Depends
from sqlmodel import select, or_, Session
from starlette.responses import JSONResponse

from app.router.validate.request_schemas import LikeRequest, DeleteCommentRequest
from app.database.models import Comment
from app.database.utils import get_session
from app.redis_queues import redis_db
from app.redis_queues.utils import push_to_queue, check_redis_health
from app.router.utils import get_current_user_id
from app.websocket import sio
from settings import REDIS_QUEUE


router = APIRouter(prefix='/social_action', tags=["SocialAction"])


@router.post('/like')
@check_redis_health
async def like(
    data: LikeRequest,
    user_id: int = Depends(get_current_user_id)
):
    task_id = str(uuid.uuid4())
    action_group = 'LIKE'
    action = 'REMOVE' if data.is_liked else 'ADD'
    task_payload = {
        "action_group": action_group,
        "action": action,
        "user_id": user_id,
        "post_id": data.post_id,
        "task_id": task_id
    }

    push_to_queue(task_payload)


@router.delete('/delete_comment')
async def delete_comment(
    data: DeleteCommentRequest,
    session: Session = Depends(get_session)
):
    comment_id = data.comment_id

    statement = select(
        Comment
    ).filter(or_(
        Comment.parent_id == comment_id,
        Comment.id == comment_id
    ))
    comments = session.exec(statement).all()
    for comment in comments:
        comment.deleted = True
    session.commit()

    comment_delete = max(comments, key=lambda x: x.parent_id is None)
    socket_data = {"id": comment_delete.id, "post_id": comment_delete.post_id}

    await sio.emit('delete_comment', socket_data)
