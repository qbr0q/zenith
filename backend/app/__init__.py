from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from settings import allow_origins
from app.database import init_db
from app.router import routers
from app.redis_queues import start_worker_thread


def run_server(app):
    apply_config(app)
    init_db()
    include_handlers(app)
    start_worker_thread()

    uvicorn.run(
        app,
        host='localhost',
        port=8080
    )


def include_handlers(app):
    for api_router in routers:
        app.include_router(api_router)


def apply_config(app):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allow_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
