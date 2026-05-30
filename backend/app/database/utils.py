import uuid
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import SessionLocal


async def get_session() -> AsyncSession:
    """
    Открывает сессию с бд
    :return: Session
    """
    async with SessionLocal() as session:
        yield session


def generate_short_slug():
    return str(uuid.uuid4())[:8]
