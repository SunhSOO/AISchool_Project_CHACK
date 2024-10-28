from fastapi import APIRouter, Depends, HTTPException

from database.repository import UserRepository
from schema.request import SignUpRequest, LogInRequest
from schema.response import UserSchema
from service.user import UserService

# FastAPI의 APIRouter 객체 생성
# prefix: "/users"로 설정하면 모든 경로가 "/users"로 시작됨
# tags: OpenAPI 문서에서 'Users' 태그 아래에 이 API들이 표시됨
router = APIRouter(
    prefix="/users",
    tags=["Users"],
)

# POST 요청을 처리하는 회원가입(sign-up) 엔드포인트
# /users/sign-up 경로에서 사용자를 등록
@router.post("/sign-up", response_model=UserSchema)
def sign_up(request: SignUpRequest, repository: UserRepository = Depends(), service: UserService = Depends()):
    # 전달된 사용자 ID로 기존 사용자가 있는지 확인
    existing_user = repository.get_user_by_user_id(request.user_id)
    if existing_user:
        raise HTTPException(status_code=400, detail="이미 존재하는 사용자 ID입니다.")
    
    # 전달된 이메일로 기존 사용자가 있는지 확인
    existing_email = repository.get_user_by_user_email(request.user_email)
    if existing_email:
        raise HTTPException(status_code=400, detail="이미 존재하는 이메일입니다.")
    
    # 비밀번호를 해시 처리
    hashed_password = service.hash_password(request.password)
    
    # 새로운 사용자 생성 및 저장
    user = repository.save_user(repository.model.create(
        user_id=request.user_id,
        user_name=request.user_name,
        hashed_password=hashed_password,  # 해시된 비밀번호 저장
        user_email=request.user_email
    ))
    
    # 생성된 사용자 정보를 반환 (UserSchema로 변환)
    return UserSchema.model_validate(user)

# POST 요청을 처리하는 로그인(log-in) 엔드포인트
# /users/log-in 경로에서 사용자가 로그인을 시도
@router.post("/log-in", response_model=UserSchema)
def log_in(request: LogInRequest, repository: UserRepository = Depends(), service: UserService = Depends()):
    # 전달된 사용자 ID로 사용자를 조회
    user = repository.get_user_by_user_id(request.user_id)
    
    # 사용자가 존재하지 않거나 비밀번호가 일치하지 않으면 401 오류 반환
    if not user or not service.verify_password(request.password, user.user_pw):
        raise HTTPException(status_code=401, detail="잘못된 인증 정보입니다.")
    
    # 로그인 성공 시 사용자 정보를 반환 (UserSchema로 변환)
    return UserSchema.model_validate(user)
