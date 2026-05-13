from authx import AuthX, AuthXConfig

from app.core import config


config = AuthXConfig(
    JWT_CSRF_METHODS=config.auth.csrf_methods,
    JWT_SECRET_KEY=config.auth.secret_key,
    JWT_TOKEN_LOCATION=config.auth.token_location,
    JWT_ACCESS_COOKIE_NAME=config.auth.access_cookie_name,
    JWT_ACCESS_TOKEN_EXPIRES=config.auth.access_token_expires,
    JWT_REFRESH_COOKIE_NAME=config.auth.refresh_cookie_name,
    JWT_REFRESH_TOKEN_EXPIRES=config.auth.refresh_token_expires
)
security = AuthX(config=config)
