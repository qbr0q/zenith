from pydantic import BaseModel


class LoginPost(BaseModel):
    mail: str
    password: str


class SignUpPost(BaseModel):
    mail: str
    username: str
    password: str


class LikePost(BaseModel):
    user_id: int
    post_id: int
    is_liked: bool
