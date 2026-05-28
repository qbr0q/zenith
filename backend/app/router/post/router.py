import json
from fastapi import APIRouter, Depends, HTTPException,\
    UploadFile, File, Form
from sqlmodel import select
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.utils import get_session
from app.router.post.shemas import PostSchema
from app.router.utils import get_current_user_id, get_optional_user_id
from app.router.post.utils import get_comment_branch, \
    attach_post_images, get_feed_posts, get_post_by_slug
from app.database.models import Post
from app.websocket import sio


router = APIRouter(prefix="/posts", tags=["Post"])


@router.get("/", response_model=List[PostSchema])
async def last_posts(
    user_id: int = Depends(get_optional_user_id),
    session: AsyncSession = Depends(get_session)
):
    posts = await get_feed_posts(session, user_id)

    result = []
    for post_obj, is_liked in posts:
        validate_obj = PostSchema.model_validate(post_obj)
        validate_obj.is_liked = is_liked
        validate_obj.comments = get_comment_branch(validate_obj.comments, user_id)
        result.append(validate_obj)
    return result


@router.get("/{post_slug}/", response_model=PostSchema)
def post_by_id(
    post_slug: str | None,
    user_id: int = Depends(get_optional_user_id),
    session: AsyncSession = Depends(get_session)
):
    post_obj, is_liked = get_post_by_slug(session, post_slug, user_id)
    post = PostSchema.model_validate(post_obj)
    post.is_liked = is_liked
    post.comments = get_comment_branch(post.comments, user_id)
    return post


@router.post("/")
async def create_post(
    text: Optional[str] = Form(None),
    data: List[UploadFile] = File(None),
    session: AsyncSession = Depends(get_session),
    user_id: int = Depends(get_current_user_id)
):
    try:
        new_post = Post(text=text, user_id=user_id)
        session.add(new_post)
        await session.flush()
        await session.refresh(new_post)
        await attach_post_images(session, data, new_post.id, user_id)

        post_json = json.loads(PostSchema.model_validate(new_post).model_dump_json())
        await sio.emit("new_post", post_json)

        await session.commit()
        return {"status": "success"}
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{post_id}/")
async def delete_post(
    post_id: int | None,
    session: AsyncSession = Depends(get_session)
):
    statement = select(
        Post
    ).filter(
        Post.id == post_id
    )
    record = await session.exec(statement)
    post = record.one()
    post.deleted = True
    await session.commit()

    await sio.emit("delete_post", {"post_id": post_id})
