from sqlmodel import SQLModel, create_engine

from app.core import config


engine = create_engine(config.db.url)


def init_db():
    SQLModel.metadata.create_all(engine)
    print('Подключение к основной базе инициализировано успешно.')
