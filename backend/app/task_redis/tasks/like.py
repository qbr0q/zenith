from taskiq import TaskiqDepends
from sqlalchemy import update, delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.task_redis import broker
from app.database.utils import get_session
from .mapping import model_mapping
from .enums import LikeActionType


@broker.task
async def process_new_like(
        payload: dict,
        session: AsyncSession = TaskiqDepends(get_session)
) -> None:
    content_id = payload.get("content_id")
    user_id = payload.get("user_id")
    model, model_like, field_name = model_mapping.get(
        payload.get("type")
    )
    like_kwargs = {
        field_name: content_id,
        "user_id": user_id
    }

    try:
        if payload.get("action") == LikeActionType.add:
            session.add(model_like(**like_kwargs))
            await session.exec(
                update(model)
                .where(
                    model.id == content_id
                )
                .values(like_count=model.like_count + 1)
            )
        elif payload.get("action") == LikeActionType.remove:
            await session.exec(
                delete(model_like).where(
                    getattr(model_like, field_name) == content_id,
                    model_like.user_id == user_id
                )
            )
            await session.exec(
                update(model)
                .where(
                    model.id == content_id
                )
                .values(like_count=model.like_count - 1)
            )
    except Exception as e:
        print("error", e)
        await session.rollback()
    else:
        await session.commit()
