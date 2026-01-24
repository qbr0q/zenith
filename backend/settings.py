import os
from datetime import timedelta

from dotenv import load_dotenv
from authx import AuthX, AuthXConfig


allow_origins = ["http://localhost:3000", "http://127.0.0.1:3000", "http://zenith.com:3000"]
host = '0.0.0.0'
port = 8080

load_dotenv("config.env")

config = AuthXConfig()
config.JWT_CSRF_METHODS = []
config.JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
config.JWT_ACCESS_COOKIE_NAME = os.getenv('JWT_COOKIE_NAME')
config.JWT_TOKEN_LOCATION = ['cookies']
config.JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
security = AuthX(config=config)

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
BLOCK_TIMEOUT = 1
REDIS_QUEUE = os.getenv('REDIS_QUEUE', 'action_queue')

