from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime


# 1. Схема для UserInfo
class UserInfoRead(BaseModel):
    bio: str | None

    model_config = ConfigDict(from_attributes=True)


# 2. Схема для User (Автор поста)
class UserRead(BaseModel):
    id: int
    username: str
    first_name: Optional[str] = None
    second_name: Optional[str] = None

    # Вложенная связь 1:1
    info: Optional[UserInfoRead] = None

    model_config = ConfigDict(from_attributes=True)


class LikeSchema(BaseModel):
    is_removed: bool | None

    model_config = ConfigDict(from_attributes=True)


# 3. Схема для Post
class PostRead(BaseModel):
    id: int
    create_date: datetime
    text: str
    like_count: int

    author: UserRead
    likes: Optional[LikeSchema] | None

    model_config = ConfigDict(from_attributes=True)


class LoginPost(BaseModel):
    mail: str
    password: str


class SignUpPost(BaseModel):
    mail: str
    username: str
    password: str


class LikeSchema(BaseModel):
    is_liked: int
    post_id: int
    user_id: int
