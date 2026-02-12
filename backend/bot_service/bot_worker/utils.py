from content import post_texts

from random import choice


def create_post(bot):
    post_text = choice(post_texts)
    bot.create_post(post_text)


bot_actions = [create_post]
