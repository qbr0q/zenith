import os
from datetime import timedelta

from dotenv import load_dotenv
from authx import AuthX, AuthXConfig


load_dotenv("config.env")

config = AuthXConfig()
config.JWT_CSRF_METHODS = []
config.JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
config.JWT_ACCESS_COOKIE_NAME = os.getenv('JWT_COOKIE_NAME')
config.JWT_TOKEN_LOCATION = ['cookies']
config.JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
security = AuthX(config=config)

allow_origins = ["http://localhost:3000"]
