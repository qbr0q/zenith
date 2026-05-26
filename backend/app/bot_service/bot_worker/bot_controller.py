import json
import threading
from time import sleep
from random import choice, uniform

from app.core import settings
from app.bot_service.bot_worker.bot import CommunityBot
from app.bot_service.bot_worker.utils import bot_actions


def run_bots():
    with open(settings.bot.accounts_source) as file:
        bots_config = json.load(file)

    threads = []
    for bot_config in bots_config:
        t = threading.Thread(target=bot_worker, args=(bot_config,), daemon=True)
        threads.append(t)
        t.start()
    for t in threads:
        t.join()


def bot_worker(bot_config):
    bot = CommunityBot(username=bot_config["username"], password=bot_config["password"])
    bot.login()

    while True:
        try:
            action = choice(bot_actions)
            action(bot)

            sleep(uniform(3, 12))
        except Exception as e:
            print(f"Bot action error: {str(e)}")
            sleep(3)
