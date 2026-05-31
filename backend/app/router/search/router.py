from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.utils import get_session
from app.router.post.service import PostManager
from app.router.utils import get_optional_user_id


router = APIRouter(prefix="/search", tags=["Search"])


@router.get("/")
async def search(
        query: str,
        user_id: int = Depends(get_optional_user_id),
        session: AsyncSession = Depends(get_session)
):
    query = query.strip()
    posts = await PostManager.get_feed_posts(session, user_id, filter_by=query)
    return posts
