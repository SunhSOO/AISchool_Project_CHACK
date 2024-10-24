from fastapi import APIRouter, Depends, HTTPException
from typing import List

from database.repository import FittingRepository
from schema.request import CreateFittingRequest
from schema.response import FittingSchema

# FastAPI의 APIRouter 객체 생성
# prefix: "/fittings"로 설정하면 모든 경로가 "/fittings"로 시작
# tags: OpenAPI 문서에서 'Fittings' 태그 아래에 이 API들이 표시됨
router = APIRouter(
    prefix="/fittings",
    tags=["Fittings"],
)

# GET 요청을 처리하는 엔드포인트 - /fittings 경로에서 피팅 목록을 조회
@router.get("/", response_model=List[FittingSchema])
def get_fittings(avatar_idx: int, repository: FittingRepository = Depends()):
    # 아바타 ID(avatar_idx)를 기반으로 피팅 목록 조회
    fittings = repository.get_fittings_by_avatar_idx(avatar_idx)
    # 조회된 피팅 데이터를 FittingSchema로 변환하여 반환
    return [FittingSchema.model_validate(fitting) for fitting in fittings]

# POST 요청을 처리하는 엔드포인트 - /fittings 경로에서 새로운 피팅 생성
@router.post("/", response_model=FittingSchema)
def create_fitting(
    request: CreateFittingRequest, repository: FittingRepository = Depends()
):
    # 요청(request)에 따라 새로운 피팅을 생성하고 데이터베이스에 저장
    fitting = repository.create_fitting(repository.model(**request.model_dump()))
    # 생성된 피팅 정보를 FittingSchema로 반환
    return FittingSchema.model_validate(fitting)
