from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select, Session, and_
from sqlalchemy.orm import contains_eager
from typing import List
import json

from app.database.utils import get_session
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

    # оставляем только комментарии, кол-во лайков которых больше, чем на посте
    posts_schemas = [PostSchema.model_validate(post) for post in posts]
    for post in posts_schemas:
        if not post.comments:
            continue
        top_comment = max(post.comments, key=lambda x: x.like_count)
        if top_comment.parent_id:
            parent = next((c for c in post.comments if c.id == top_comment.parent_id), None)
            if parent:
                parent.comments = [top_comment]
                post.comments = [parent]
            else:
                post.comments = [top_comment]
        else:
            post.comments = [top_comment]

    return posts_schemas


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


@router.post('/delete_post')
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
