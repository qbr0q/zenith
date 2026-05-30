import httpx

from app.core import settings, config
from app.service.ai_service import AIService
from app.service.ai_service.enums import RequestType


class ZenithAi:
    def __init__(self):
        self.config = None
        self.token = None
        self.base_url = settings.server.base_url
        self.bot_config = config.bot
        self.client = httpx.AsyncClient(trust_env=False)
        self.ai_service = AIService()

    async def login(self):
        response = await self.client.post(
            f"{self.base_url}/auth/login",
            json={
                "mail": self.bot_config.mail,
                "password": self.bot_config.password
            }
        )
        if response.status_code == 200:
            data = response.json()
            self.token = data.get("access_token")

    async def get_headers(self):
        if not self.token:
            await self.login()

        return {
            "Content-Type": "application/json"
        }

    async def send_comment(self, post_data):
        headers = await self.get_headers()
        ai_answer = await self.ai_service.request(
            post_data, RequestType.zenith_ai_answer
        )

        await self.client.post(
            f"{self.base_url}/comment/",
            data={
                "post_id": post_data.get("id"),
                "text": ai_answer
            },
            files=[]
        )
