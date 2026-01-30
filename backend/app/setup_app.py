from fastapi import APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn

from settings import allow_origins, port, host
from app.database import init_db
from app.router import routers
from app.redis_queues import start_redis_worker
from app.websocket import run_socket


def get_configured_app(app):
    apply_config(app)
    init_db()
    include_handlers(app)
    start_redis_worker()
    run_socket(app)
    return app


def run_server(app):
    configured_app = get_configured_app(app)

    uvicorn.run(
        configured_app,
        host=host,
        port=port
    )


def include_handlers(app):
    api_main_router = APIRouter(prefix="/api")
    for api_router in routers:
        api_main_router.include_router(api_router)
    app.mount("/media", StaticFiles(directory="app/media"), name="media")
    app.include_router(api_main_router)


def apply_config(app):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allow_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
