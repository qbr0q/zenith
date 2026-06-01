from fastapi import APIRouter, Depends, HTTPException,\
    UploadFile, File, Form
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.utils import get_session
from app.router.post.shemas import PostSchema
from app.router.utils import get_current_user_id, get_optional_user_id
from app.websocket import sio
from .manager import PostManager


router = APIRouter(prefix="/post", tags=["Post"])


@router.get("", response_model=List[PostSchema])
async def last_posts(
    user_id: int = Depends(get_optional_user_id),
    session: AsyncSession = Depends(get_session)
):
    posts = await PostManager.get_feed_posts(session, user_id)
    return posts


@router.get("/{slug}/", response_model=PostSchema)
async def post_by_id(
    slug: str | None,
    user_id: int = Depends(get_optional_user_id),
    session: AsyncSession = Depends(get_session)
):
    try:
        post = await PostManager.get_post_by_slog(session, user_id, slug)
        return post
    except Exception as e:
        raise HTTPException(500, str(e))


@router.post("/")
async def create_post(
    text: Optional[str] = Form(None),
    topic: List[str] = Form(None),
    data: List[UploadFile] = File(None),
    session: AsyncSession = Depends(get_session),
    user_id: int = Depends(get_current_user_id)
):
    try:
        post = await PostManager.create_post(session, user_id, text, data, topic)
        await sio.emit("new_post", post)
        return {"status": "success"}
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{post_id}/")
async def delete_post(
    post_id: int | None,
    session: AsyncSession = Depends(get_session)
):
    await PostManager.delete_post(session, post_id)
    await sio.emit("delete_post", {"post_id": post_id})
