import os
import uuid
import shutil
from sqlmodel import select, exists, and_
from sqlalchemy.orm import contains_eager
from fastapi import UploadFile

from app.database.models import Post, PostLike, \
    Comment, PostImage
from settings import post_content_folder


def get_feed_posts(session, user_id, limit=15):
    subq = (
        select(Post.id)
        .filter(Post.deleted == False)
        .order_by(Post.create_date.desc())
        .limit(limit)
        .subquery()
    )

    is_liked_stmt = (
        exists()
        .where(PostLike.post_id == Post.id)
        .where(PostLike.user_id == user_id)
        .correlate(Post)
    ).label("is_liked")

    statement = (
        select(Post, is_liked_stmt)
        .join(subq, Post.id == subq.c.id)
        .outerjoin(Comment, and_(
            Comment.post_id == Post.id,
            Comment.deleted == False
        ))
        .outerjoin(
            PostImage, PostImage.post_id == Post.id
        ).options(
            contains_eager(Post.comments)
        )
        .order_by(Post.create_date.desc())
    )

    posts = session.exec(statement).unique().all()
    return posts


def get_best_comment_branch(comments, post_like_count, user_id):
    """
    Оставляет в списке только ветку самого залайканного комментария.
    """
    if not comments:
        return []

    top_comment = max(comments, key=lambda x: x.like_count)
    if top_comment.like_count < post_like_count:
        return []
    top_comment.is_liked = bool(top_comment.likes and [i for i in top_comment.likes if i.user_id == user_id])

    if top_comment.parent_id:
        parent = next((c for c in comments if c.id == top_comment.parent_id), None)
        if parent:
            parent.is_liked = bool(parent.likes and [i for i in parent.likes if i.user_id == user_id])
            parent.comments = [top_comment]
            return [parent]
        else:
            return []

    return [top_comment]


async def save_post_image(upload_file: UploadFile) -> str:
    extension = os.path.splitext(upload_file.filename)[1].lower()
    unique_name = f"{uuid.uuid4()}{extension}"
    file_path = os.path.join(post_content_folder, unique_name)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)

    return unique_name
