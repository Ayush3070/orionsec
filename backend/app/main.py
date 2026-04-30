from fastapi import FastAPI
from app.api.routes import threats, logs 
from app.services.fetch_services import fetch_and_store_all_threats

app = FastAPI()

app.include_router(threats.router, prefix="/threats")

app.include_router(logs.router ,prefix="/logs")


def fetch_and_store_threats():
    return fetch_and_store_all_threats()