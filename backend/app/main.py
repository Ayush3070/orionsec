from fastapi import FastAPI
from app.api.routes import threats, logs 

app = FastAPI()

app.include_router(threats.router, prefix="/threats")

app.include_router(logs.router ,prefix="/logs")


def fetch_and_store_threats():
    fetch_abuseipdb()
    fetch_otx()

    return {"status":"All Threat Sources Updated Successfully"}