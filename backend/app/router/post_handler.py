from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select, Session, and_
from sqlalchemy.orm import contains_eager
from typing import List
import json

from app.database.utils import get_session
from app.router.utils import get_best_comment_branch
from app.database.models import Post, PostLike, Comment
from app.router.validate.response_shemas import PostSchema
from app.router.validate.request_schemas import CreatePostRequest, DeletePostRequest
from app.websocket import sio


router = APIRouter(prefix='/post', tags=["Post"])


@router.get('/last_posts', response_model=List[PostSchema])
def last_posts(
    user_id: int | None = None,
    session: Session = Depends(get_session)
):
    subq = (
        select(Post.id)
        .filter(Post.deleted == False)
        .order_by(Post.create_date.desc())
        .limit(15)
        .subquery()
    )

    statement = (
        select(Post)
        .join(subq, Post.id == subq.c.id)
        .outerjoin(PostLike, and_(
            PostLike.user_id == user_id,
            PostLike.post_id == Post.id
        ))
        .outerjoin(Comment, and_(
            Comment.post_id == Post.id,
            Comment.deleted == False
        ))
        .options(
            contains_eager(Post.likes),
            contains_eager(Post.comments)
        )
        .order_by(Post.create_date.desc())
    )
    posts = session.exec(statement).unique().all()

    result = []
    for post in posts:
        post_schema = PostSchema.model_validate(post)
        post_schema.comments = get_best_comment_branch(post_schema.comments)
        result.append(post_schema)
    return result


@router.post('/create_post')
async def create_post(
    data: CreatePostRequest,
    session: Session = Depends(get_session)
):
    record = Post(text=data.post_content, user_id=data.user_id)
    session.add(record)
    session.commit()

    post_json = json.loads(PostSchema.model_validate(record).model_dump_json())
    await sio.emit('new_post', post_json)

    return {'status': 'success'}


@router.delete('/delete_post')
async def delete_post(
    data: DeletePostRequest,
    session: Session = Depends(get_session)
):
    post_id = data.post_id

    statement = select(
        Post
    ).filter(
        Post.id == post_id
    )
    post = session.exec(statement).one()
    post.deleted = True
    session.commit()

    await sio.emit('delete_post', {"post_id": post_id})
