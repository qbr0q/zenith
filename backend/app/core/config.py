from pydantic import BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict

from datetime import timedelta


class DBConfig(BaseSettings):
    user: str
    password: str
    host: str
    port: int
    db: str

    @property
    def url(self):
        return f"postgresql://{self.user}:{self.password}@{self.host}:{self.port}/{self.db}"


class AuthConfig(BaseModel):
    secret_key: str
    access_cookie_name: str
    refresh_cookie_name: str
    csrf_methods: list[str] = []
    token_location: list[str] = ['cookies']
    access_token_expires: timedelta = timedelta(hours=1)
    refresh_token_expires: timedelta = timedelta(days=30)


class RedisConfig(BaseModel):
    host: str
    port: int
    timeout: int
    action_queue: str = "action_queue"


class Config(BaseSettings):
    auth: AuthConfig
    db: DBConfig
    redis: RedisConfig

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        env_nested_delimiter="__"
    )


config = Config()
