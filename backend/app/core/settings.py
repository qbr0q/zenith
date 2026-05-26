from pydantic import BaseModel
from pydantic_settings import SettingsConfigDict
from pydantic_settings_yaml import YamlBaseSettings


class ServerSettings(BaseModel):
    host: str
    port: int
    allow_origins: list[str]


class PathSettings(BaseModel):
    post_content: str
    comment_content: str


class BotSettings(BaseModel):
    accounts_source: str


class Settings(YamlBaseSettings):
    server: ServerSettings
    source: PathSettings
    bot: BotSettings

    model_config = SettingsConfigDict(
        yaml_file="settings.yml"
    )


settings = Settings()
