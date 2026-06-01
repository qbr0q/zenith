from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import ForeignKey, Column, Integer
from datetime import datetime
from typing import Optional, List

from app.database.utils import generate_short_slug


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