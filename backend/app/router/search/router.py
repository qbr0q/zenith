from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.utils import get_session
from app.router.post.service import PostManager
from app.router.utils import get_optional_user_id


router = APIRouter(prefix="/search", tags=["Search"])


@router.get("")
async def search(
        query: str | None = None,
        topic: str | None = None,
        user_id: int = Depends(get_optional_user_id),
        session: AsyncSession = Depends(get_session)
):
    posts = await PostManager.get_feed_posts(
        session,
        user_id,
        filter_by_query=query.strip() if query else None,
        filter_by_topic=topic.strip() if topic else None
    )
    return posts
