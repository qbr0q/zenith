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


class CommentLikeSchema(BaseModel):
    user_id: int

    model_config = ConfigDict(from_attributes=True)


class CommentSchema(BaseModel):
    id: int
    text: str
    parent_id: int | None
    create_date: datetime
    like_count: int
    post_id: int
    deleted: bool
    type: str = "comment"
    is_liked: bool = None

    author: Optional[AuthorSchema] | None
    comments: List["CommentSchema"] = []
    likes: List["CommentLikeSchema"] | None = []

    model_config = ConfigDict(from_attributes=True)


class PostImageSchema(BaseModel):
    image_path: str

    model_config = ConfigDict(from_attributes=True)


class PostSchema(BaseModel):
    id: int
    create_date: datetime
    text: str
    like_count: int
    type: str = "post"
    is_liked: bool = None

    author: AuthorSchema
    comments: List[CommentSchema] | None
    image: List[PostImageSchema] | None = []

    model_config = ConfigDict(from_attributes=True)
