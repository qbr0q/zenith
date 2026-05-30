from typing import Literal
from openai import AsyncOpenAI

from app.core import settings, config
from .prompt import system_prompts, user_prompts
from .shemas import AiResponse
from .enums import RequestType


class AIService:
    def __init__(self):
        self.base_url = settings.ai.base_url
        self.base_model = settings.ai.default_model
        self.api_key = config.private.openrouter_api_key
        self._client = None

    @property
    def client(self):
        if self._client is None:
            self._client = self._create_client()
        return self._client

    def _create_client(self):
        client = AsyncOpenAI(
            base_url=self.base_url,
            api_key=self.api_key,
        )
        return client

    async def request(
            self,
            content_data: str,
            action_type: str,
            response_type: Literal["text", "json_object"] = "text",
            temperature: float = 0.7
    ):
        system_prompt, user_prompt = self._get_prompts(action_type, content_data)

        response = await self._call_api(system_prompt, user_prompt,
                                        response_type, temperature)

        return response.content

    async def _call_api(
            self,
            system_prompt: str,
            user_prompt: str,
            response_type,
            temperature
    ):
        try:
            response = await self.client.chat.completions.create(
                model=self.base_model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=temperature,
                response_format={"type": response_type}
            )

            return AiResponse(
                content=response.choices[0].message.content.strip(),
                token_used=response.usage.total_tokens
            )

        except Exception as e:
            print(f"AI Service Error: {e}")
            return None

    @staticmethod
    def _get_prompts(action_type, content_data):
        if action_type == RequestType.zenith_ai_answer:
            return system_prompts.ZENITH_AI_SYSTEM_PROMPT, \
                   user_prompts.DEFAULT_USER_PROMPT.format(
                       author_username=content_data.get("author").get("username"),
                       post_text=content_data.get("text")
                   )
