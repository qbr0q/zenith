import uuid
from sqlmodel import Session
from app.database import engine


def get_session():
    """
    Открывает сессию с бд
    :return: Session
    """
    with Session(engine) as session:
        yield session


def generate_short_slug():
    return str(uuid.uuid4())[:8]
