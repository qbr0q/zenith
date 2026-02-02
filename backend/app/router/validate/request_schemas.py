from pydantic import BaseModel


class LoginRequest(BaseModel):
    mail: str
    password: str


class SignUpRequest(BaseModel):
    mail: str
    username: str
    password: str


class LikeRequest(BaseModel):
    post_id: int
    is_liked: bool


class DeletePostRequest(BaseModel):
    post_id: int


class DeleteCommentRequest(BaseModel):
    comment_id: int
