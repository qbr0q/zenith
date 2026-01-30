from sqlmodel import SQLModel, create_engine
import os

from .models import Post

db_url = "postgresql://{}:{}@{}:{}/{}".format(
    os.getenv('POSTGRES_USER'), os.getenv('POSTGRES_PASSWORD'), os.getenv('POSTGRES_HOST'),
    os.getenv('POSTGRES_PORT'), os.getenv('POSTGRES_DB')
)
engine = create_engine(db_url)


def init_db():
    SQLModel.metadata.create_all(engine)
    print('Подключение к основной базе инициализировано успешно.')
