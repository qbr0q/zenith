from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import ForeignKey, Column, Integer
from datetime import datetime
from typing import Optional, List
from app.router.auth.enums import UserRole


class User(SQLModel, table=True):
    __tablename__ = "user_profile"
    id: Optional[int] = Field(default=None, primary_key=True)
    create_date: Optional[datetime] = Field(default_factory=datetime.now)
    username: str = Field(unique=True)
    password: str
    first_name: str = Field(nullable=True)
    second_name: str = Field(nullable=True)
    mail: str = Field(unique=True)
    role: str = Field(default=UserRole.user, nullable=True)

    info: Optional["UserInfo"] = Relationship(
        back_populates="user",
        sa_relationship_kwargs={"lazy": "selectin"}
    )
    posts: List["Post"] = Relationship(back_populates="author")
    comments: Optional["Comment"] = Relationship(back_populates="author")


class UserInfo(SQLModel, table=True):
    __tablename__ = "user_info"
    id: Optional[int] = Field(default=None, primary_key=True)
    create_date: Optional[datetime] = Field(default_factory=datetime.now)
    bio: str = Field(nullable=True)
    is_verified: bool = Field(default=False)
    avatar_url: str = Field(default='default.jpg')
    user_id: Optional[int] = Field(
        default=None,
        sa_column=Column(Integer, ForeignKey("user_profile.id", ondelete="CASCADE"))
    )

    user: User = Relationship(back_populates="info")
