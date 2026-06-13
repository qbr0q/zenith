from app.database.models import PostLike, CommentLike, \
    Post, Comment


model_mapping = {
    "post": (Post, PostLike, "post_id"),
    "comment": (Comment, CommentLike, "comment_id")
}
