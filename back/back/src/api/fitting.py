# api/fitting.py

from fastapi import APIRouter, Depends, HTTPException
from typing import List
from database.repository import FittingRepository, AvatarRepository, ClothesRepository
from schema.request import CreateFittingRequest
from schema.response import FittingSchema
from database.orm import Fitting
from security import get_current_user
from database.orm import User

router = APIRouter(
    prefix="/fittings",
    tags=["Fittings"],
)

@router.get("/", response_model=List[FittingSchema], summary="피팅목록 조회", description="아바타들의 피팅을 조회합니다.")
def get_fittings(avatar_idx: int, repository: FittingRepository = Depends(), current_user: User = Depends(get_current_user)):
    # 아바타 소유자 검증
    avatar_repository = AvatarRepository()
    avatar = avatar_repository.get_avatar_by_id(avatar_idx)
    if not avatar or avatar.user_id != current_user.user_id:
        raise HTTPException(status_code=404, detail="피팅을 찾을 수 없습니다.")
    fittings = repository.get_fittings_by_avatar_idx(avatar_idx)
    return [FittingSchema.model_validate(fitting) for fitting in fittings]

@router.post("/", response_model=FittingSchema, summary="3D화된 유저 아바타에 옷 입히기", description="아바타에 옷을 입힙니다.")
async def create_fitting(
    request: CreateFittingRequest,
    repository: FittingRepository = Depends(),
    avatar_repository: AvatarRepository = Depends(),
    clothes_repository: ClothesRepository = Depends(),
    current_user: User = Depends(get_current_user)
):
    # 아바타 유효성 검사
    avatar = avatar_repository.get_avatar_by_id(request.avatar_idx)
    if not avatar or avatar.user_id != current_user.user_id:
        raise HTTPException(status_code=404, detail="피팅할 아바타를 찾을 수 없습니다.")

    # 옷 유효성 검사
    clothes = clothes_repository.get_clothes_by_id(request.clo_idx)
    if not clothes:
        raise HTTPException(status_code=404, detail="피팅할 옷을 찾을 수 없습니다.")

    # 피팅 생성
    fitting = repository.create_fitting(Fitting(avatar_idx=request.avatar_idx, clo_idx=request.clo_idx))
    return FittingSchema.model_validate(fitting)

 #**새로운 엔드포인트 추가: DELETE /fittings/{fitting_idx}**
@router.delete("/{fitting_idx}", status_code=204, summary="피팅 삭제", description="특정 피팅을 삭제합니다.")
async def delete_fitting(
    fitting_idx: int,
    repository: FittingRepository = Depends(),
    avatar_repository: AvatarRepository = Depends(),
    current_user: User = Depends(get_current_user)
 ):
    fitting = repository.get_fitting_by_id(fitting_idx)
    if not fitting:
        raise HTTPException(status_code=404, detail="피팅을 찾을 수 없습니다.")
     
     # 아바타 소유자 검증
    avatar = avatar_repository.get_avatar_by_id(fitting.avatar_idx)
    if not avatar or avatar.user_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="해당 피팅을 삭제할 권한이 없습니다.")
     
    repository.delete_fitting(fitting_idx)
    return