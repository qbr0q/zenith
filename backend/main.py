from fastapi import FastAPI
from app import run_server


app = FastAPI()

if __name__ == "__main__":
    run_server(app)
