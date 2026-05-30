from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import ForeignKey, Column, Integer
from datetime import datetime
from typing import Optional, List

from app.database.utils import generate_short_slug


class User(SQLModel, table=True):
    __tablename__ = "user_profile"
    id: Optional[int] = Field(default=None, primary_key=True)
    create_date: Optional[datetime] = Field(default_factory=datetime.now)
    username: str = Field(unique=True)
    password: str
    first_name: str = Field(nullable=True)
    second_name: str = Field(nullable=True)
    mail: str = Field(unique=True)

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


class Post(SQLModel, table=True):
    __tablename__ = "post"
    id: Optional[int] = Field(default=None, primary_key=True)
    create_date: Optional[datetime] = Field(default_factory=datetime.now)
    user_id: Optional[int] = Field(default=None, foreign_key="user_profile.id")
    text: Optional[str]
    like_count: int = Field(default=0)
    slug: str = Field(index=True, default_factory=generate_short_slug)
    deleted: bool = Field(default=False)

    author: "User" = Relationship(
        back_populates="posts",
        sa_relationship_kwargs={"lazy": "selectin"}
    )
    likes: Optional["PostLike"] = Relationship(
        back_populates="post",
        sa_relationship_kwargs={"uselist": False, "lazy": "selectin"}
    )
    comments: List["Comment"] = Relationship(
        back_populates="post",
        sa_relationship_kwargs={"lazy": "selectin"}
    )
    image: List["PostImage"] = Relationship(
        back_populates="post",
        sa_relationship_kwargs={"lazy": "selectin"}
    )


class PostLike(SQLModel, table=True):
    __tablename__ = "post_like"
    id: Optional[int] = Field(default=None, primary_key=True)
    post_id: Optional[int] = Field(
        default=None,
        sa_column=Column(Integer, ForeignKey("post.id", ondelete="CASCADE"))
    )
    user_id: int

    post: Optional["Post"] = Relationship(back_populates="likes")


class PostImage(SQLModel, table=True):
    __tablename__ = "post_image"
    id: Optional[int] = Field(default=None, primary_key=True)
    create_date: Optional[datetime] = Field(default_factory=datetime.now)
    post_id: Optional[int] = Field(
        default=None,
        sa_column=Column(Integer, ForeignKey("post.id", ondelete="CASCADE"))
    )
    image_path: str
    author_id: Optional[int] = Field(default=None, foreign_key="user_profile.id")

    post: Optional["Post"] = Relationship(back_populates="image")


class Comment(SQLModel, table=True):
    __tablename__ = "comment"
    id: Optional[int] = Field(default=None, primary_key=True)
    post_id: Optional[int] = Field(
        default=None,
        sa_column=Column(Integer, ForeignKey("post.id", ondelete="CASCADE"))
    )
    author_id: Optional[int] = Field(default=None, foreign_key="user_profile.id")
    text: str
    parent_id: int | None
    create_date: Optional[datetime] = Field(default_factory=datetime.now)
    like_count: int = Field(default=0)
    slug: str = Field(unique=True, index=True, default_factory=generate_short_slug)
    deleted: bool = Field(default=False)

    post: Optional["Post"] = Relationship(
        back_populates="comments",
        sa_relationship_kwargs={"lazy": "selectin"}
    )
    author: Optional["User"] = Relationship(
        back_populates="comments",
        sa_relationship_kwargs={"lazy": "selectin"}
    )
    likes: List["CommentLike"] = Relationship(
        back_populates="comments",
        sa_relationship_kwargs={"lazy": "selectin"}
    )
    image: List["CommentImage"] = Relationship(
        back_populates="comment",
        sa_relationship_kwargs={"lazy": "selectin"}
    )


class CommentLike(SQLModel, table=True):
    __tablename__ = "comment_like"
    id: Optional[int] = Field(default=None, primary_key=True)
    comment_id: Optional[int] = Field(
        default=None,
        sa_column=Column(Integer, ForeignKey("comment.id", ondelete="CASCADE"))
    )
    user_id: int

    comments: Optional["Comment"] = Relationship(back_populates="likes")


class CommentImage(SQLModel, table=True):
    __tablename__ = "comment_image"
    id: Optional[int] = Field(default=None, primary_key=True)
    create_date: Optional[datetime] = Field(default_factory=datetime.now)
    comment_id: Optional[int] = Field(
        default=None,
        sa_column=Column(Integer, ForeignKey("comment.id", ondelete="CASCADE"))
    )
    image_path: str
    author_id: Optional[int] = Field(default=None, foreign_key="user_profile.id")

    comment: Optional["Comment"] = Relationship(back_populates="image")
