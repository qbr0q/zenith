from fastapi import APIRouter, Depends
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.utils import get_session
from app.router.utils import get_current_user_id
from .mapper import rb_mapping
from .enums import ReferenceBookName


router = APIRouter(prefix="/reference_book", tags=["ReferenceBook"])


@router.get("/{rb_name}")
async def load_reference_book(
        rb_name: ReferenceBookName,
        user_id: int = Depends(get_current_user_id),
        session: AsyncSession = Depends(get_session)
):
    rb_model = rb_mapping.get(rb_name)

    statement = select(rb_model).order_by(rb_model.id)
    result = await session.execute(statement)
    rb_data = result.scalars().all()

    return rb_data
