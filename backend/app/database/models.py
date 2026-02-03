from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import ForeignKey, Column, Integer
from datetime import datetime
from typing import Optional, List


class Post(SQLModel, table=True):
    __tablename__ = "Post"
    id: Optional[int] = Field(default=None, primary_key=True)
    create_date: Optional[datetime] = Field(default_factory=datetime.now)
    user_id: Optional[int] = Field(default=None, foreign_key="UserZ.id")
    text: str
    like_count: int = Field(default=0)
    deleted: bool = Field(default=False)

    author: Optional["User"] = Relationship(back_populates="posts")
    likes: Optional["PostLike"] = Relationship(back_populates="post", sa_relationship_kwargs={"uselist": False})
    comments: List["Comment"] = Relationship(back_populates="post")
    image: List["PostImage"] = Relationship(back_populates="post")


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
    comments: Optional["Comment"] = Relationship(back_populates="author")


class UserInfo(SQLModel, table=True):
    __tablename__ = "UserInfo"
    id: Optional[int] = Field(default=None, primary_key=True)
    create_date: Optional[datetime] = Field(default_factory=datetime.now)
    bio: str = Field(nullable=True)
    is_verified: bool = Field(default=False)
    avatar_url: str = Field(default='default.jpg')
    user_id: Optional[int] = Field(
        default=None,
        sa_column=Column(Integer, ForeignKey("UserZ.id", ondelete="CASCADE"))
    )

    user: User = Relationship(back_populates="info")


class PostLike(SQLModel, table=True):
    __tablename__ = "PostLike"
    id: Optional[int] = Field(default=None, primary_key=True)
    post_id: Optional[int] = Field(
        default=None,
        sa_column=Column(Integer, ForeignKey("Post.id", ondelete="CASCADE"))
    )
    user_id: int

    post: Optional["Post"] = Relationship(back_populates="likes")


class CommentLike(SQLModel, table=True):
    __tablename__ = "CommentLike"
    id: Optional[int] = Field(default=None, primary_key=True)
    comment_id: Optional[int] = Field(
        default=None,
        sa_column=Column(Integer, ForeignKey("Comment.id", ondelete="CASCADE"))
    )
    user_id: int

    comments: Optional["Comment"] = Relationship(back_populates="likes")


class Comment(SQLModel, table=True):
    __tablename__ = "Comment"
    id: Optional[int] = Field(default=None, primary_key=True)
    post_id: Optional[int] = Field(
        default=None,
        sa_column=Column(Integer, ForeignKey("Post.id", ondelete="CASCADE"))
    )
    author_id: Optional[int] = Field(default=None, foreign_key="UserZ.id")
    text: str
    parent_id: int | None
    create_date: Optional[datetime] = Field(default_factory=datetime.now)
    like_count: int = Field(default=0)
    deleted: bool = Field(default=False)

    post: Optional["Post"] = Relationship(back_populates="comments")
    author: Optional["User"] = Relationship(back_populates="comments")
    likes: Optional["CommentLike"] = Relationship(back_populates="comments",
                                                  sa_relationship_kwargs={"uselist": False})


class PostImage(SQLModel, table=True):
    __tablename__ = "PostImage"
    id: Optional[int] = Field(default=None, primary_key=True)
    create_date: Optional[datetime] = Field(default_factory=datetime.now)
    post_id: Optional[int] = Field(
        default=None,
        sa_column=Column(Integer, ForeignKey("Post.id", ondelete="CASCADE"))
    )
    image_path: str
    author_id: Optional[int] = Field(default=None, foreign_key="UserZ.id")

    post: Optional["Post"] = Relationship(back_populates="image")
