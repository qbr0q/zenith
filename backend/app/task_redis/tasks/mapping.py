from app.database.models.like import PostLike, CommentLike
from app.database.models.post import Post
from app.database.models.comment import Comment


model_mapping = {
    "post": (Post, PostLike, "post_id"),
    "comment": (Comment, CommentLike, "comment_id")
}
