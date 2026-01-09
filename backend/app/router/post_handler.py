from fastapi import APIRouter, Depends, HTTPException
from starlette.responses import JSONResponse as JSONResponse
from sqlmodel import select, Session, and_
from sqlalchemy.orm import contains_eager
from typing import List
import uuid
import json

from app.database.utils import get_session
from app.database.models import Post, PostLike
from app.router.validate.response_shemas import (PostSchema,
    LikeSchema, CreatePostSchema)
from app.redis_queues import redis_db
from app.websocket import sio
from settings import REDIS_QUEUE


router = APIRouter(prefix='/post', tags=["Post"])


@router.get('/last_posts', response_model=List[PostSchema])
def last_posts(
    user_id: int | None = None,
    session: Session = Depends(get_session)
):
    statement = select(
        Post
    ).outerjoin(
        PostLike, and_(
            PostLike.user_id == user_id,
            PostLike.post_id == Post.id
        )
    ).options(
        contains_eager(Post.likes)
    ).filter(
        Post.deleted == False
    ).order_by(
        Post.create_date.desc()
    ).limit(10)
    posts = session.exec(statement).all()

    return posts


@router.post('/create_post')
async def create_post(
    data: CreatePostSchema,
    session: Session = Depends(get_session)
):
    record = Post(text=data.post_content, user_id=data.user_id)
    session.add(record)
    session.commit()

    post_json = json.loads(PostSchema.model_validate(record).model_dump_json())
    await sio.emit('new_post', post_json)

    return {'status': 'success'}


@router.post('/like')
async def like(
    data: LikeSchema
):
    if not redis_db:
        return HTTPException(503, "Очередь обработки недоступна. Попробуйте позже.")
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
