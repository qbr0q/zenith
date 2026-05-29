from fastapi import APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn

from app.core import settings
from app.router import routers
from app.websocket import run_socket


def get_configured_app(app):
    apply_config(app)
    include_handlers(app)
    run_socket(app)
    return app


def run_server(app):
    uvicorn.run(
        app,
        host=settings.server.host,
        port=settings.server.port
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
        allow_origins=settings.server.allow_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
