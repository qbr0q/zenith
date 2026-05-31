import json
from sqlmodel import select, exists, and_
from sqlalchemy.orm import contains_eager

from app.core import settings
from app.database.models import Post, PostLike, \
    Comment, PostImage, PostTopicLink, RbTopic
from app.task_redis.tasks import process_ai_answer
from app.router.post.shemas import PostSchema
from app.router.utils import _handle_upload


class PostManager:
    @classmethod
    def get_base_post_statement(cls, user_id: int):
        is_liked_stmt = (
            exists()
            .where(PostLike.post_id == Post.id)
            .where(PostLike.user_id == user_id)
            .correlate(Post)
        ).label("is_liked")

        statement = (
            select(Post, is_liked_stmt)
            .outerjoin(Comment, and_(Comment.post_id == Post.id, Comment.deleted == False))
            .outerjoin(PostImage, PostImage.post_id == Post.id)
            .filter(Post.deleted == False)
            .options(contains_eager(Post.comments))
        )
        return statement

    @classmethod
    async def get_raw_feed_posts(cls, session, user_id, limit, filter_by_query, filter_by_topic):
        subq = (
            select(Post.id)
            .filter(Post.deleted == False)
            .order_by(Post.create_date.desc())
            .limit(limit)
            .subquery()
        )

        statement = (
            cls.get_base_post_statement(user_id)
            .join(subq, Post.id == subq.c.id)
            .order_by(Post.create_date.desc())
        )

        if filter_by_query:
            statement = statement.where(
                Post.text.ilike(f"%{filter_by_query}%")
            )

        if filter_by_topic:
            statement = (
                statement
                .join(PostTopicLink, Post.id == PostTopicLink.post_id)
                .join(RbTopic, PostTopicLink.topic_id == RbTopic.id)
                .where(RbTopic.slug == filter_by_topic)
            )

        result = await session.exec(statement)
        posts = result.unique().all()
        return posts

    @classmethod
    async def get_feed_posts(cls, session, user_id, limit=15,
                             filter_by_query=None, filter_by_topic=None):
        posts = await cls.get_raw_feed_posts(
            session, user_id, limit,
            filter_by_query, filter_by_topic)

        result = []
        for post_obj, is_liked in posts:
            validate_obj = PostSchema.model_validate(post_obj)
            comments = cls.get_comment_branch(validate_obj.comments, user_id)
            result.append(
                cls.prepare_post(validate_obj, is_liked, comments)
            )
        return result

    @classmethod
    async def get_post_by_slog(cls, session, user_id, post_slug):
        statement = cls.get_base_post_statement(user_id).where(Post.slug == post_slug)
        post_record = await session.exec(statement)
        post_obj, is_liked = post_record.unique().first()
        post = PostSchema.model_validate(post_obj)
        comments = cls.get_comment_branch(post.comments, user_id)
        return cls.prepare_post(post, is_liked, comments)

    @classmethod
    def prepare_post(cls, post, is_liked, comments):
        post.is_liked = is_liked
        post.comments = comments
        return post

    @classmethod
    def get_comment_branch(cls, comments, user_id):
        comment_ids = {comment.id: cls.set_is_like(comment, user_id)
                       for comment in comments}
        comment_branch = []

        for comment in comments:
            if comment.parent_id:
                parent = comment_ids.get(comment.parent_id)
                parent.comments.append(comment)
            else:
                comment_branch.append(comment)

        comment_branch_sorted = sorted(comment_branch, key=lambda x: x.create_date)
        return comment_branch_sorted

    @classmethod
    def set_is_like(cls, comment, user_id):
        comment.is_liked = user_id in [i.user_id for i in comment.likes]
        return comment

    @classmethod
    async def create_post(cls, session, user_id, text, data, topic: list[str]):
        new_post = Post(text=text, user_id=user_id)
        session.add(new_post)
        await session.flush()
        if topic:
            for t_id in topic:
                link = PostTopicLink(post_id=new_post.id, topic_id=int(t_id))
                session.add(link)
        await cls.attach_post_images(session, data, new_post.id, user_id)
        await session.refresh(new_post)

        post_json = json.loads(PostSchema.model_validate(new_post).model_dump_json())

        await session.commit()
        if text is not None and "@ZenithAi" in text:
            await process_ai_answer.kiq(post_json)
        return post_json

    @classmethod
    async def attach_post_images(cls, session, files, post_id, author_id):
        data = await _handle_upload(files, author_id,
                                    settings.source.post_content, post_id=post_id)
        new_image = [PostImage(**item) for item in data]
        session.add_all(new_image)

    @classmethod
    async def delete_post(cls, session, post_id):
        statement = select(
            Post
        ).filter(
            Post.id == post_id
        )
        record = await session.exec(statement)
        post = record.one()
        post.deleted = True
        await session.commit()
