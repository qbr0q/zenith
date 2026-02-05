from fastapi import Response
from sqlmodel import select, Session

from app.database.models import User
from settings import security


def get_user_by_main(session: Session, mail: str):
    statement = select(User).filter(User.mail == mail)
    query = session.exec(statement)
    user = query.first()

    return user


def create_access_token(user_id):
    access_token = security.create_access_token(
        uid=str(user_id)
    )
    return access_token


def create_refresh_token(user_id):
    refresh_token = security.create_refresh_token(
        uid=str(user_id)
    )
    return refresh_token


def set_access_token(response: Response, token):
    response.set_cookie(
        key=security.config.JWT_ACCESS_COOKIE_NAME,
        value=token,
        expires=security.config.JWT_ACCESS_TOKEN_EXPIRES
    )


def set_refresh_token(response: Response, token):
    response.set_cookie(
        key=security.config.JWT_REFRESH_COOKIE_NAME,
        value=token,
        expires=security.config.JWT_REFRESH_TOKEN_EXPIRES
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
