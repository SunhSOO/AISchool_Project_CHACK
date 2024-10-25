# api/fitting.py

from fastapi import APIRouter, Depends, HTTPException
from typing import List

from database.repository import FittingRepository
from schema.request import CreateFittingRequest
from schema.response import FittingSchema
from sqlalchemy import select  # 추가: select 임포트
from database.orm import Fitting  # 추가: Fitting 임포트

router = APIRouter(
    prefix="/fittings",
    tags=["Fittings"],
)

@router.get("/", response_model=List[FittingSchema])
def get_fittings(avatar_idx: int, repository: FittingRepository = Depends()):
    fittings = repository.get_fittings_by_avatar_idx(avatar_idx)
    return [FittingSchema.model_validate(fitting) for fitting in fittings]

@router.post("/", response_model=FittingSchema)
def create_fitting(
    request: CreateFittingRequest, repository: FittingRepository = Depends()
):
    fitting = repository.create_fitting(repository.model(**request.model_dump()))
    return FittingSchema.model_validate(fitting)

 #**새로운 엔드포인트 추가: DELETE /fittings/{fitting_idx}**
@router.delete("/{fitting_idx}", status_code=204, summary="피팅 삭제", description="특정 피팅을 삭제합니다.")
def delete_fitting(fitting_idx: int, repository: FittingRepository = Depends()):
    fitting = repository.get_fitting_by_id(fitting_idx)  # 수정: 레포지토리 메서드 사용
    if not fitting:
        raise HTTPException(status_code=404, detail="피팅을 찾을 수 없습니다.")
    repository.delete_fitting(fitting_idx)
    return