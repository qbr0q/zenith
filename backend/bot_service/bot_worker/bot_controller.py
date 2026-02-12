import json
import threading
from time import sleep
from random import choice, uniform

from .bot import CommunityBot
from .utils import bot_actions
from settings import config_name


def run_bots():
    with open(config_name) as file:
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

            sleep(uniform(5, 7))
        except Exception as e:
            print(f"Bot action error: {str(e)}")
            sleep(3)
