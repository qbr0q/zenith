from fastapi import FastAPI
from app import run_server, get_configured_app


app = FastAPI()
get_configured_app(app)


if __name__ == "__main__":
    run_server(app)
