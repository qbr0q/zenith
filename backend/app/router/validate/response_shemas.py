from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime


class UserInfoSchema(BaseModel):
    bio: str | None
    is_verified: bool
    avatar_url: str

    model_config = ConfigDict(from_attributes=True)


class AuthorSchema(BaseModel):
    id: int
    username: str
    first_name: Optional[str] = None
    second_name: Optional[str] = None

    info: Optional[UserInfoSchema] = None

    model_config = ConfigDict(from_attributes=True)


class LikeSchema(BaseModel):
    id: int
    is_removed: bool | None

    model_config = ConfigDict(from_attributes=True)


class CommentSchema(BaseModel):
    id: int
    content: str
    parent_id: int | None
    create_date: datetime
    like_count: int
    deleted: bool

    author: Optional[AuthorSchema] | None
    child_comments: List["CommentSchema"] = []

    model_config = ConfigDict(from_attributes=True)


class PostSchema(BaseModel):
    id: int
    create_date: datetime
    text: str
    like_count: int

    author: AuthorSchema
    likes: Optional[LikeSchema] | None
    comments: List[CommentSchema] | None

    model_config = ConfigDict(from_attributes=True)


class CreatePostSchema(BaseModel):
    post_content: str
    user_id: int
