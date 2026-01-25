from pydantic import BaseModel


class LoginRequest(BaseModel):
    mail: str
    password: str


class SignUpRequest(BaseModel):
    mail: str
    username: str
    password: str


class LikeRequest(BaseModel):
    user_id: int
    post_id: int
    is_liked: bool


class CreatePostRequest(BaseModel):
    post_content: str
    user_id: int


class DeletePostRequest(BaseModel):
    post_id: int
