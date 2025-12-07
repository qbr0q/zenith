from app.database.models import Post, PostLike

from sqlmodel import select, Session, update
from app.database import engine


def process_like_task(
    task_data: dict
):
    session = Session(engine)
    user_id = task_data.get('user_id')
    post_id = task_data.get('post_id')
    action = task_data.get('action')
    is_removed = action == 'REMOVE'

    try:
        statement = select(
            PostLike
        ).filter(
            PostLike.user_id == user_id,
            PostLike.post_id == post_id
        )
        post_like_record = session.exec(statement).first()
        if post_like_record:
            post_like_record.is_removed = is_removed
        else:
            post_like_record = PostLike(user_id=user_id, post_id=post_id, is_removed=is_removed)
        session.add(post_like_record)

        if is_removed:
            update_stmt = update(Post).where(Post.id == post_id).values(
                like_count=Post.like_count - 1
            )
        else:
            update_stmt = update(Post).where(Post.id == post_id).values(
                like_count=Post.like_count + 1
            )
        session.execute(update_stmt)
        session.commit()
    except Exception as e:
        session.rollback()
        print(f"Ошибка транзакции для поста {post_id}: {e}")
    finally:
        session.close()
