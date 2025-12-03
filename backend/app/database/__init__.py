from sqlmodel import SQLModel, create_engine
import os

from .models import Post

db_url = "postgresql://{}:{}@{}:{}/{}".format(
    os.getenv('DB_NAME'), os.getenv('DB_PASSWORD'), os.getenv('DB_HOST'),
    os.getenv('DB_PORT'), os.getenv('DB_SCHEMA')
)
engine = create_engine(db_url)


def init_db():
    SQLModel.metadata.create_all(engine)
