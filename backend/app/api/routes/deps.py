from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
from app.core.security import get_current_user

security = HTTPBearer()

async def get_current_user_dependency(token: str = Depends(security)):
    user = await get_current_user(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user
