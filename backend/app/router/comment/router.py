import json
from fastapi import APIRouter, HTTPException,\
    Depends, Form, UploadFile, File
from sqlmodel import select, or_
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.utils import get_session
from app.database.models.comment import Comment
from app.router.utils import get_current_user_id
from app.router.comment.shemas import CommentSchema
from app.websocket import sio
from .service import attach_comment_images


router = APIRouter(prefix="/comment", tags=["Comment"])


@router.post("/")
async def create_comment(
    parent_id: int | None = Form(default=None),
    post_id: int = Form(...),
    text: Optional[str] = Form(None),
    data: List[UploadFile] = File(None),
    session: AsyncSession = Depends(get_session),
    user_id: int = Depends(get_current_user_id)
):
    try:
        new_comment = Comment(text=text, author_id=user_id, post_id=post_id, parent_id=parent_id)
        session.add(new_comment)
        await session.flush()
        await attach_comment_images(session, data, user_id, new_comment.id)
        await session.refresh(new_comment)

        comment_json = json.loads(CommentSchema.model_validate(new_comment).model_dump_json())
        await sio.emit("new_comment", comment_json)

        await session.commit()
        return {"status": "success"}
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{comment_id}/")
async def delete_comment(
    comment_id: int | None,
    session: AsyncSession = Depends(get_session)
):
    statement = select(
        Comment
    ).filter(or_(
        Comment.parent_id == comment_id,
        Comment.id == comment_id
    ))
    record = await session.exec(statement)
    comments = record.all()

    for comment in comments:
        comment.deleted = True
    await session.commit()

    comment_delete = max(comments, key=lambda x: x.parent_id is None)
    socket_data = {"id": comment_delete.id, "post_id": comment_delete.post_id}

    await sio.emit("delete_comment", socket_data)
