from app.task_redis import broker
from app.service.zenith_ai import ZenithAi


@broker.task
async def process_ai_answer(
        post_data: dict
) -> None:
    zenith_ai = ZenithAi()
    await zenith_ai.send_comment(post_data)
