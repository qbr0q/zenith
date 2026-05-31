from pydantic import BaseModel, ConfigDict
from typing import List
from datetime import datetime

from app.router.shemas import AuthorSchema, PostImageSchema
from app.router.comment.shemas import CommentSchema


class PostSchema(BaseModel):
    id: int
    create_date: datetime
    text: str | None = None
    like_count: int
    type: str = "post"
    is_liked: bool = None
    slug: str

    author: AuthorSchema
    comments: List[CommentSchema] | None
    image: List[PostImageSchema] | None = []

    model_config = ConfigDict(from_attributes=True)
