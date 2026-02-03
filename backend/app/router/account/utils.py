from fastapi import Response
from sqlmodel import select, Session

from app.database.models import User
from settings import security


def get_user_by_main(session: Session, mail: str):
    statement = select(User).filter(User.mail == mail)
    query = session.exec(statement)
    user = query.first()

    return user


def create_token(user: User):
    token = security.create_access_token(
        uid=str(user.id)
    )
    return token


def set_token(response: Response, token):
    response.set_cookie(
        key=security.config.JWT_ACCESS_COOKIE_NAME,
        value=token,
        expires=security.config.JWT_ACCESS_TOKEN_EXPIRES
    )


def get_response_user(user):
    return {
        "id": user.id,
        "username": user.username,
        "info": {
            "is_verified": user.info.is_verified,
            "avatar_url": user.info.avatar_url
        }
    }
