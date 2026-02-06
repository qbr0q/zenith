import uuid
import json
from fastapi import APIRouter, HTTPException,\
    Depends, Form, UploadFile, File
from sqlmodel import select, or_, Session
from typing import List

from app.router.validate.request_schemas import LikeRequest, DeleteCommentRequest
from app.router.validate.response_shemas import CommentSchema
from app.database.models import Comment
from app.database.utils import get_session
from app.redis_queues.utils import push_to_queue, check_redis_health
from app.router.utils import get_current_user_id
from app.router.social_action.utils import attach_comment_images
from app.websocket import sio


router = APIRouter(prefix='/social_action', tags=["SocialAction"])


@router.post('/like')
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

    push_to_queue(task_payload)


@router.post('/create_comment')
async def create_comment(
    parent_id: int | None = Form(default=None),
    post_id: int = Form(...),
    text: str = Form(...),
    data: List[UploadFile] = File(None),
    session: Session = Depends(get_session),
    user_id: int = Depends(get_current_user_id)
):
    try:
        new_comment = Comment(text=text, author_id=user_id, post_id=post_id, parent_id=parent_id)
        session.add(new_comment)
        session.flush()

        await attach_comment_images(session, data, user_id, new_comment.id)
        session.commit()

        comment_json = json.loads(CommentSchema.model_validate(new_comment).model_dump_json())

        await sio.emit('new_comment', comment_json)

        return {'status': 'success'}

    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=str(e))


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
