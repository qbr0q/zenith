from sqlmodel import Session
from app.database import engine


# def test():
#     from .models import PostLike
#     with Session(engine) as session:
#         r = PostLike(user_id=1, post_id=1)
#         session.add(r)
#         session.commit()


def get_session():
    """
    Открывает сессию с бд
    :return: Session
    """
    with Session(engine) as session:
        yield session
