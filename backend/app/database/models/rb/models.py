from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List

from app.database.models.post.models import PostTopicLink


class RbTopic(SQLModel, table=True):
    __tablename__ = "rb_topic"

    id: Optional[int] = Field(default=None, primary_key=True)
    code: int
    name: str = Field(unique=True, index=True)
    slug: str = Field(unique=True)

    post: List["Post"] = Relationship(
        back_populates="topics",
        link_model=PostTopicLink,
        sa_relationship_kwargs={"lazy": "selectin"}
    )
