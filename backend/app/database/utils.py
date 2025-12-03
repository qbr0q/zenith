from sqlmodel import Session
from app.database import engine


# def test():
#     with Session() as session:
#         r = User(username='zo1v', password=123, mail='123@vk1.com')
#         session.add(r)
#         session.commit()


def get_session():
    """
    Открывает сессию с бд
    :return: Session
    """
    with Session(engine) as session:
        yield session
