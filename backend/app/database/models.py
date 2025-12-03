from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional, List


class Post(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    create_date: Optional[datetime] = Field(default_factory=datetime.now)
    user_id: Optional[int] = Field(default=None, foreign_key="UserZ.id")
    text: str
    like_count: int = Field(default=0)

    author: Optional["User"] = Relationship(back_populates="posts")


class User(SQLModel, table=True):
    __tablename__ = "UserZ"
    id: Optional[int] = Field(default=None, primary_key=True)
    create_date: Optional[datetime] = Field(default_factory=datetime.now)
    username: str = Field(unique=True)
    password: str
    first_name: str = Field(nullable=True)
    second_name: str = Field(nullable=True)
    mail: str = Field(unique=True)

    info: Optional["UserInfo"] = Relationship(back_populates="user")
    posts: List["Post"] = Relationship(back_populates="author")


class UserInfo(SQLModel, table=True):
    __tablename__ = "UserInfo"
    id: Optional[int] = Field(default=None, primary_key=True)
    create_date: Optional[datetime] = Field(default_factory=datetime.now)
    bio: str = Field(nullable=True)
    is_verified: bool = Field(default=False)
    user_id: Optional[int] = Field(default=None, foreign_key="UserZ.id", unique=True)

    user: User = Relationship(back_populates="info")

