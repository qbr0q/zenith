from sqlmodel import select, Session
from fastapi import Response

from app.database.models import User
from settings import security
from settings import config


def get_user_by_main(session: Session, mail: str):
    statement = select(User).filter(User.mail == mail)
    query = session.exec(statement)
    user = query.first()

    return user


def get_user(session: Session, user_id: int):
    statement = select(User).filter(User.id == user_id)
    query = session.exec(statement)
    user = query.first()

    return user


def create_token(user: User):
    token = security.create_access_token(
        str(user.id)
    )
    return token


def set_token(response: Response, token):
    response.set_cookie(
        key=config.JWT_ACCESS_COOKIE_NAME,
        value=token,
        expires=config.JWT_ACCESS_TOKEN_EXPIRES
    )
