from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

from app.router.shemas import AuthorSchema, PostImageSchema, CommentLikeSchema


class CommentSchema(BaseModel):
    id: int
    text: str | None = None
    parent_id: int | None
    create_date: datetime
    like_count: int
    post_id: int
    deleted: bool
    type: str = "comment"
    is_liked: bool = None
    slug: str

    author: Optional[AuthorSchema] | None
    comments: List["CommentSchema"] = []
    likes: List[CommentLikeSchema] | None = []
    image: List[PostImageSchema] | None = []

    model_config = ConfigDict(from_attributes=True)
