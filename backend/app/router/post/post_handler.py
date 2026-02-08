import json
from fastapi import APIRouter, Depends, HTTPException,\
    UploadFile, File, Form
from sqlmodel import select, Session
from typing import List

from app.database.utils import get_session
from app.router.utils import get_current_user_id
from app.router.post.utils import get_comment_branch, \
    attach_post_images, get_feed_posts
from app.database.models import Post
from app.router.validate.response_shemas import PostSchema
from app.router.validate.request_schemas import DeletePostRequest
from app.websocket import sio


router = APIRouter(prefix='/post', tags=["Post"])


@router.get('/last_posts', response_model=List[PostSchema])
def last_posts(
    user_id: int | None = None,
    session: Session = Depends(get_session)
):
    posts = get_feed_posts(session, user_id)

    result = []
    for post_obj, is_liked in posts:
        validate_obj = PostSchema.model_validate(post_obj)
        validate_obj.is_liked = is_liked
        validate_obj.comments = get_comment_branch(validate_obj.comments, user_id)
        result.append(validate_obj)
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

        await attach_post_images(session, data, new_post.id, user_id)
        session.commit()

        post_json = json.loads(PostSchema.model_validate(new_post).model_dump_json())

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
