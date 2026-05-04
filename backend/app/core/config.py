from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    MONGO_URL: str = "mongodb://localhost:27017/"
    MONGO_DB: str = "orionsec"

    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000"]

    RATE_LIMIT_PER_MINUTE: int = 60

    REDIS_URL: str = "redis://localhost:6379/0"

    ABUSEIPDB_API_KEY: str = ""
    OTX_API_KEY: str = ""

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
