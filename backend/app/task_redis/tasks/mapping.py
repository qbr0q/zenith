from app.database.models import Post, Comment, PostLike, CommentLike


model_mapping = {
    "post": (Post, PostLike, "post_id"),
    "comment": (Comment, CommentLike, "comment_id")
}
