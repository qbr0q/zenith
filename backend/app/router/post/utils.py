from fastapi import HTTPException
from sqlmodel import select, exists, and_
from sqlalchemy.orm import contains_eager

from app.database.models import Post, PostLike, \
    Comment, PostImage, CommentLike
from app.router.utils import _handle_upload
from settings import post_content_folder


def get_base_post_statement(user_id: int):
    is_liked_stmt = (
        exists()
        .where(PostLike.post_id == Post.id)
        .where(PostLike.user_id == user_id)
        .correlate(Post)
    ).label("is_liked")

    statement = (
        select(Post, is_liked_stmt)
        .outerjoin(Comment, and_(Comment.post_id == Post.id, Comment.deleted == False))
        .outerjoin(PostImage, PostImage.post_id == Post.id)
        .filter(Post.deleted == False)
        .options(contains_eager(Post.comments))
    )
    return statement


def get_feed_posts(session, user_id, limit=15):
    subq = (
        select(Post.id)
        .filter(Post.deleted == False)
        .order_by(Post.create_date.desc())
        .limit(limit)
        .subquery()
    )

    statement = (
        get_base_post_statement(user_id)
        .join(subq, Post.id == subq.c.id)
        .order_by(Post.create_date.desc())
    )

    posts = session.exec(statement).unique().all()
    return posts


def get_post_by_slug(session, post_slug, user_id):
    try:
        statement = get_base_post_statement(user_id).where(Post.slug == post_slug)
        return session.exec(statement).unique().first()
    except Exception as e:
        raise HTTPException(500, str(e))


def get_comment_branch(comments, user_id):
    comment_ids = {comment.id: setIsLike(comment, user_id)
                   for comment in comments}
    comment_branch = []

    for comment in comments:
        if comment.parent_id:
            parent = comment_ids.get(comment.parent_id)
            parent.comments.append(comment)
        else:
            comment_branch.append(comment)

    comment_branch_sorted = sorted(comment_branch, key=lambda x: x.create_date)
    return comment_branch_sorted


def setIsLike(comment, user_id):
    comment.is_liked = user_id in [i.user_id for i in comment.likes]
    return comment


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


async def attach_post_images(session, files, post_id, author_id):
    data = await _handle_upload(files, author_id,
                                post_content_folder, post_id=post_id)
    new_image = [PostImage(**item) for item in data]
    session.add_all(new_image)
