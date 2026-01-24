from sqlmodel import Session
from app.database import engine


# def test():
#     from .models import Comment
#     with Session(engine) as session:
#         r = Comment(post_id=105, author_id=11, content='test comment')
#         session.add(r)
#         session.commit()
# test()


def get_session():
    """
    Открывает сессию с бд
    :return: Session
    """
    with Session(engine) as session:
        yield session
