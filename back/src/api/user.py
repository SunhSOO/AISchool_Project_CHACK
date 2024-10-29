# api/user.py

from fastapi import APIRouter, Depends, HTTPException, Request  # Request 추가
from database.repository import UserRepository
from schema.request import SignUpRequest, LogInRequest
from schema.response import UserSchema, Token
from service.user import UserService
from security import create_access_token, get_current_user
from datetime import timedelta
from dotenv import load_dotenv
import os
# User 클래스 임포트 추가
from database.orm import User  # 프로젝트 구조에 맞게 경로 수정

load_dotenv()

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)

@router.post("/sign-up", response_model=UserSchema)
async def sign_up(
    request: Request,  # 수정: Request 추가하여 base_url 사용 (기본 인자 먼저)
    signup_request: SignUpRequest,
    repository: UserRepository = Depends(),
    service: UserService = Depends()
):
    existing_user = repository.get_user_by_user_id(signup_request.user_id)
    if existing_user:
        raise HTTPException(status_code=400, detail="이미 존재하는 사용자 ID입니다.")
    existing_email = repository.get_user_by_user_email(signup_request.user_email)
    if existing_email:
        raise HTTPException(status_code=400, detail="이미 존재하는 이메일입니다.")
    hashed_password = service.hash_password(signup_request.password)
    user = repository.save_user(repository.model.create(
        user_id=signup_request.user_id,
        user_name=signup_request.user_name,
        hashed_password=hashed_password,
        user_email=signup_request.user_email
    ))
    return UserSchema.model_validate(user)

@router.post("/log-in", response_model=Token)
async def log_in(
    request: Request,  # 수정: Request 추가하여 base_url 사용 (기본 인자 먼저)
    login_request: LogInRequest,
    repository: UserRepository = Depends(),
    service: UserService = Depends()
):
    user = repository.get_user_by_user_id(login_request.user_id)
    if not user or not service.verify_password(login_request.password, user.user_pw):
        raise HTTPException(status_code=401, detail="잘못된 인증 정보입니다.")
    access_token_expires = timedelta(minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30)))
    access_token = create_access_token(
        data={"sub": user.user_id}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserSchema)
async def read_users_me(request: Request, current_user: User = Depends(get_current_user)):
    return current_user  # Pydantic 모델이 자동으로 변환하도록 함
