from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import ForeignKey, Column, Integer
from datetime import datetime
from typing import Optional, List

from app.database.utils import generate_short_slug


class PostTopicLink(SQLModel, table=True):
    __tablename__ = "post_topic_link"

    post_id: int = Field(foreign_key="post.id", primary_key=True)
    topic_id: int = Field(default=None, foreign_key="rb_topic.id", primary_key=True)


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
    topics: List["RbTopic"] = Relationship(
        back_populates="post",
        link_model=PostTopicLink,
        sa_relationship_kwargs={"lazy": "selectin"}
    )


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
