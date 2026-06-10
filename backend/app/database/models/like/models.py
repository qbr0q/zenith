from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import ForeignKey, Column, Integer
from typing import Optional


class PostLike(SQLModel, table=True):
    __tablename__ = "post_like"
    id: Optional[int] = Field(default=None, primary_key=True)
    post_id: Optional[int] = Field(
        default=None,
        sa_column=Column(Integer, ForeignKey("post.id", ondelete="CASCADE"))
    )
    user_id: int

    post: Optional["Post"] = Relationship(back_populates="likes")


class CommentLike(SQLModel, table=True):
    __tablename__ = "comment_like"
    id: Optional[int] = Field(default=None, primary_key=True)
    comment_id: Optional[int] = Field(
        default=None,
        sa_column=Column(Integer, ForeignKey("comment.id", ondelete="CASCADE"))
    )
    user_id: int

    comments: Optional["Comment"] = Relationship(back_populates="likes")
