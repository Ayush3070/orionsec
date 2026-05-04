from fastapi import APIRouter, HTTPException, status
from fastapi.security import HTTPBearer
from app.core.security import create_access_token, verify_password, USERS_DB
from pydantic import BaseModel

router = APIRouter()
security = HTTPBearer()


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


@router.post("/login", response_model=TokenResponse)
async def login(credentials: LoginRequest):
    if credentials.username not in USERS_DB:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )

    if not verify_password(credentials.password,
                           USERS_DB[credentials.username]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )

    access_token = create_access_token(data={"sub": credentials.username})
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me")
async def get_me():
    from app.core.security import get_current_user
    user = get_current_user()
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return {"username": user["user_id"]}
