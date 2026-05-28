from fastapi import FastAPI
from app import run_server, get_configured_app


from app.redis_queues import lifespan
app = FastAPI(lifespan=lifespan)
get_configured_app(app)


if __name__ == "__main__":
    run_server(app)
