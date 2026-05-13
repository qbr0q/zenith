from content import texts

from random import choice


def create_post(bot):
    post_text = choice(texts)
    data = {"text": post_text}
    bot.create_post(data)


def create_comment(bot):
    post = get_random_post(bot)
    post_id = post.get("id")
    comment_text = choice(texts)
    data = {"post_id": post_id, "text": comment_text}
    bot.create_comment(data)


def get_random_post(bot):
    posts = bot.get_last_posts()
    random_post = choice(posts)
    return random_post


bot_actions = [create_post, create_comment]
