from fastapi import Request, HTTPException
from sqlmodel import select, Session
from fastapi import Response

from app.database.models import User
from settings import security, config


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
        uid=str(user.id)
    )
    return token


def set_token(response: Response, token):
    response.set_cookie(
        key=config.JWT_ACCESS_COOKIE_NAME,
        value=token,
        expires=config.JWT_ACCESS_TOKEN_EXPIRES
    )


def get_best_comment_branch(comments):
    """
    Оставляет в списке только ветку самого залайканного комментария.
    """
    if not comments:
        return []

    top_comment = max(comments, key=lambda x: x.like_count)

    if top_comment.parent_id:
        parent = next((c for c in comments if c.id == top_comment.parent_id), None)
        if parent:
            parent.comments = [top_comment]
            return [parent]
        else:
            return []

    return [top_comment]


async def get_current_user_id(request: Request):
    token_name = security.config.JWT_ACCESS_COOKIE_NAME
    token = request.cookies.get(token_name)

    if not token:
        raise HTTPException(
            status_code=401,
            detail="Пользователь не авторизован"
        )

    try:
        access_token = await security.get_access_token_from_request(
            request
        )
        payload = security.verify_token(access_token, verify_csrf=False)
        return payload.sub
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=f"Токен не валиден: {str(e)}"
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
