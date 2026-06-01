from app.router.like.models import PostLike, CommentLike
from app.router.post.models import Post
from app.router.comment.models import Comment


model_mapping = {
    "post": (Post, PostLike, "post_id"),
    "comment": (Comment, CommentLike, "comment_id")
}
