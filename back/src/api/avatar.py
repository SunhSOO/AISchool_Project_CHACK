from fastapi import APIRouter, Depends, HTTPException
from typing import List

from database.repository import AvatarRepository
from schema.request import CreateAvatarRequest
from schema.response import AvatarSchema
from sqlalchemy.orm import Session

# FastAPI의 라우터 객체 생성
# prefix: "/avatars"로 설정하면 모든 경로가 /avatars로 시작
# tags: OpenAPI 문서에서 이 엔드포인트가 'Avatars' 태그 아래에 표시됨
router = APIRouter(
    prefix="/avatars",
    tags=["Avatars"],
)

# GET 요청을 처리하는 엔드포인트
# 사용자 ID를 기반으로 해당 사용자의 모든 아바타 목록을 조회
@router.get("/", response_model=List[AvatarSchema])
def get_avatars(user_id: str, repository: AvatarRepository = Depends()):
    # 데이터베이스에서 사용자 ID에 해당하는 아바타 목록을 조회
    avatars = repository.get_avatars_by_user_id(user_id)
    
    # 조회된 아바타 객체를 AvatarSchema로 변환하여 반환
    return [AvatarSchema.model_validate(avatar) for avatar in avatars]

# POST 요청을 처리하는 엔드포인트
# 새로운 아바타를 생성
@router.post("/", response_model=AvatarSchema)
def create_avatar(
    request: CreateAvatarRequest, repository: AvatarRepository = Depends()
):
    # 요청(request) 데이터를 바탕으로 새로운 아바타를 생성
    avatar = repository.create_avatar(repository.model(**request.model_dump()))
    
    # 생성된 아바타 객체를 AvatarSchema로 변환하여 반환
    return AvatarSchema.model_validate(avatar)

