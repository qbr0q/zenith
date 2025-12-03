from fastapi import APIRouter, Depends
from sqlmodel import select, Session
from typing import List

from app.database.utils import get_session
from app.database.models import Post
from app.router.validate.response_shemas import PostRead


router = APIRouter(prefix='/post', tags=["Post"])


@router.get('/last_posts', response_model=List[PostRead])
def last_posts(
    session: Session = Depends(get_session)
):
    statement = select(Post).limit(10)
    posts = session.exec(statement).all()

    return posts
