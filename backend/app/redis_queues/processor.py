from sqlmodel import select, Session, update

from app.database import SessionLocal
from app.database.models import Post, PostLike, Comment, CommentLike
from app.websocket import sio
from app.database import engine


async def process_like_post(
    task_data: dict
):
    session = SessionLocal()
    user_id = task_data.get('user_id')
    post_id = task_data.get('post_id')

    try:
        statement = select(
            PostLike
        ).filter(
            PostLike.user_id == user_id,
            PostLike.post_id == post_id
        )
        post_like_record = await session.exec(statement)
        post_like = post_like_record.first()
        like_count = 0
        if post_like:
            await session.delete(post_like)
            like_count -= 1
        else:
            post_like = PostLike(post_id=post_id, user_id=user_id)
            session.add(post_like)
            like_count += 1

        update_stmt = update(Post).where(Post.id == post_id).values(
            like_count=Post.like_count + like_count
        )
        await session.execute(update_stmt)
        await session.commit()

        post_record = await session.exec(select(Post).filter(Post.id == post_id))
        post = post_record.first()
        await sio.emit('likePost_update', {"id": post.id, "likeCount": post.like_count})
    except Exception as e:
        await session.rollback()
        print(f"Ошибка транзакции для поста {post_id}: {e}")
    finally:
        await session.close()


async def process_like_comment(
    task_data: dict
):
    session = Session(engine)
    user_id = task_data.get('user_id')
    comment_id = task_data.get('comment_id')

    try:
        statement = select(
            CommentLike
        ).filter(
            CommentLike.user_id == user_id,
            CommentLike.comment_id == comment_id
        )
        comments_like_record = session.exec(statement).first()
        like_count = 0
        if comments_like_record:
            session.delete(comments_like_record)
            like_count -= 1
        else:
            comments_like_record = CommentLike(comment_id=comment_id, user_id=user_id)
            session.add(comments_like_record)
            like_count += 1

        update_stmt = update(Comment).where(Comment.id == comment_id).values(
            like_count=Comment.like_count + like_count
        )
        await session.execute(update_stmt)
        session.commit()

        comment_record = session.exec(select(Comment).filter(Comment.id == comment_id)).first()
        socket_data = {"commentId": comment_record.id, "parentId": comment_record.parent_id,
                       "likeCount": comment_record.like_count, "postId": comment_record.post_id}
        await sio.emit('likeComment_update', socket_data)
    except Exception as e:
        session.rollback()
        print(f"Ошибка транзакции для поста {post_id}: {e}")
    finally:
        session.close()
