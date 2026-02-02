from fastapi import APIRouter, Depends, HTTPException,\
    UploadFile, File, Form
from sqlmodel import select, Session, and_
from sqlalchemy.orm import contains_eager
from typing import List
import json

from app.database.utils import get_session
from app.router.utils import get_best_comment_branch, \
    get_current_user_id, save_post_image
from app.database.models import Post, PostLike, Comment, PostImage
from app.router.validate.response_shemas import PostSchema
from app.router.validate.request_schemas import DeletePostRequest
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
        .outerjoin(
            PostImage, PostImage.post_id == Post.id
        ).options(
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
    text: str = Form(...),
    data: List[UploadFile] = File(None),
    session: Session = Depends(get_session),
    user_id: int = Depends(get_current_user_id)
):
    try:
        new_post = Post(text=text, user_id=user_id)
        session.add(new_post)
        session.flush()

        post_image = []
        if data:
            for file in data:
                image_url = await save_post_image(file)
                new_image = PostImage(
                    post_id=new_post.id,
                    image_path=image_url,
                    author_id=user_id
                )
                session.add(new_image)
                post_image.append(
                    {"image_path": new_image.image_path}
                )
        session.commit()
        post_json = json.loads(PostSchema.model_validate(new_post).model_dump_json())
        post_json['image'] = post_image

        await sio.emit('new_post', post_json)

        return {'status': 'success'}
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=str(e))


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
