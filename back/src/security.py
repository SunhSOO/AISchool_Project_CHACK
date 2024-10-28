# security.py

from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from database.orm import User
from database.repository import UserRepository
from pydantic import BaseModel
from dotenv import load_dotenv
import os

# 환경 변수 로드
load_dotenv()

# 환경 변수에서 SECRET_KEY 및 ALGORITHM 가져오기
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

# SECRET_KEY가 설정되지 않았을 경우 예외 발생
if not SECRET_KEY:
    raise ValueError("SECRET_KEY 환경 변수가 설정되지 않았습니다.")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class TokenData(BaseModel):
    user_id: Optional[str] = None

# HTTPBearer 인스턴스 생성
security = HTTPBearer()

def get_access_token(
    auth_header: HTTPAuthorizationCredentials | None = Depends(security)
) -> str:
    if auth_header is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not Authorized",
        )
    return auth_header.credentials  # access_token

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    # algorithm은 변수 ALGORITHM을 사용
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(
    access_token: str = Depends(get_access_token),
    repository: UserRepository = Depends()
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # decode 시 algorithms 리스트에 ALGORITHM을 포함
        payload = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = repository.get_user_by_user_id(user_id)
    if user is None:
        raise credentials_exception
    return user
