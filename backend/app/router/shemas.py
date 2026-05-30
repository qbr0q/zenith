from pydantic import BaseModel, ConfigDict
from typing import Optional


class AuthorSchema(BaseModel):
    id: int
    username: str
    first_name: Optional[str] = None
    second_name: Optional[str] = None

    info: Optional["UserInfoSchema"] = None

    model_config = ConfigDict(from_attributes=True)


class UserInfoSchema(BaseModel):
    bio: str | None
    is_verified: bool
    avatar_url: str

    model_config = ConfigDict(from_attributes=True)


class CommentLikeSchema(BaseModel):
    user_id: int

    model_config = ConfigDict(from_attributes=True)


class PostImageSchema(BaseModel):
    image_path: str

    model_config = ConfigDict(from_attributes=True)
