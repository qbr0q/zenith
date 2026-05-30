from pydantic import BaseModel


class AiResponse(BaseModel):
    content: str
    token_used: int
