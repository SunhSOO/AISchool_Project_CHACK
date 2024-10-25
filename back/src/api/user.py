# api/user.py

from fastapi import APIRouter, Depends, HTTPException

from database.repository import UserRepository
from schema.request import SignUpRequest, LogInRequest
from schema.response import UserSchema
from service.user import UserService

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)

@router.post("/sign-up", response_model=UserSchema)
def sign_up(request: SignUpRequest, repository: UserRepository = Depends(), service: UserService = Depends()):
    existing_user = repository.get_user_by_user_id(request.user_id)
    if existing_user:
        raise HTTPException(status_code=400, detail="이미 존재하는 사용자 ID입니다.")
    existing_email = repository.get_user_by_user_email(request.user_email)
    if existing_email:
        raise HTTPException(status_code=400, detail="이미 존재하는 이메일입니다.")
    hashed_password = service.hash_password(request.password)
    user = repository.save_user(repository.model.create(
        user_id=request.user_id,
        user_name=request.user_name,
        hashed_password=hashed_password,
        user_email=request.user_email
    ))
    return UserSchema.model_validate(user)

@router.post("/log-in", response_model=UserSchema)
def log_in(request: LogInRequest, repository: UserRepository = Depends(), service: UserService = Depends()):
    user = repository.get_user_by_user_id(request.user_id)
    if not user or not service.verify_password(request.password, user.user_pw):
        raise HTTPException(status_code=401, detail="잘못된 인증 정보입니다.")
    return UserSchema.model_validate(user)