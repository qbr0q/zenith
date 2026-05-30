from taskiq import TaskiqDepends
from sqlalchemy.ext.asyncio import AsyncSession

from app.task_redis import broker
from app.database.utils import get_session
from app.service.zenith_ai import ZenithAi


@broker.task
async def process_ai_answer(
        post_data: dict,
        session: AsyncSession = TaskiqDepends(get_session)
) -> None:
    zenith_ai = ZenithAi()
    await zenith_ai.send_comment(post_data)
