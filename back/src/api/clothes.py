from fastapi import APIRouter, Depends, HTTPException
from typing import List

from database.repository import ClothesRepository
from schema.request import CreateClothesRequest
from schema.response import ClothesSchema, ClothesListSchema

# FastAPI의 APIRouter 객체 생성
# prefix: "/clothes"로 설정하면 모든 경로가 "/clothes"로 시작됨
# tags: OpenAPI 문서에서 'Clothes' 그룹 아래에 이 API들이 표시됨
router = APIRouter(
    prefix="/clothes",
    tags=["Clothes"],
)

# GET 요청을 처리하는 엔드포인트 - /clothes 경로에서 옷 목록을 조회
@router.get("/", response_model=ClothesListSchema)
def get_clothes(repository: ClothesRepository = Depends()):
    # 데이터베이스에서 모든 의류 목록을 조회
    clothes = repository.get_clothes()
    # 조회된 결과를 ClothesListSchema로 반환
    return ClothesListSchema(clothes=clothes)

# GET 요청을 처리하는 엔드포인트 - /clothes/{clo_idx} 경로에서 특정 옷 조회
@router.get("/{clo_idx}", response_model=ClothesSchema)
def get_clothes_item(clo_idx: int, repository: ClothesRepository = Depends()):
    # 특정 의류 ID(clo_idx)로 데이터베이스에서 해당 옷을 조회
    clothes_item = repository.get_clothes_by_id(clo_idx)
    if not clothes_item:
        # 옷이 없을 경우 404 에러 반환
        raise HTTPException(status_code=404, detail="옷을 찾을 수 없습니다.")
    # 조회된 결과를 ClothesSchema로 반환
    return ClothesSchema.model_validate(clothes_item)

# POST 요청을 처리하는 엔드포인트 - /clothes 경로에서 새로운 옷 생성
@router.post("/", response_model=ClothesSchema)
def create_clothes(
    request: CreateClothesRequest, repository: ClothesRepository = Depends()
):
    # 요청(request)에 따라 새로운 옷을 데이터베이스에 생성
    clothes_item = repository.create_clothes(request)
    # 생성된 옷 정보를 ClothesSchema로 반환
    return ClothesSchema.model_validate(clothes_item)

# PATCH 요청을 처리하는 엔드포인트 - /clothes/{clo_idx} 경로에서 특정 옷 정보 업데이트
@router.patch("/{clo_idx}", response_model=ClothesSchema)
def update_clothes(
    clo_idx: int, request: CreateClothesRequest, repository: ClothesRepository = Depends()
):
    # 특정 의류 ID(clo_idx)로 옷 정보를 조회
    clothes_item = repository.get_clothes_by_id(clo_idx)
    if not clothes_item:
        # 옷이 없을 경우 404 에러 반환
        raise HTTPException(status_code=404, detail="옷을 찾을 수 없습니다.")
    # 조회된 옷 정보를 요청(request)에 따라 업데이트
    updated_clothes = repository.update_clothes(clothes_item, request)
    # 업데이트된 옷 정보를 ClothesSchema로 반환
    return ClothesSchema.model_validate(updated_clothes)

# DELETE 요청을 처리하는 엔드포인트 - /clothes/{clo_idx} 경로에서 특정 옷 삭제
@router.delete("/{clo_idx}", status_code=204)
def delete_clothes(clo_idx: int, repository: ClothesRepository = Depends()):
    # 특정 의류 ID(clo_idx)로 옷 정보를 조회
    clothes_item = repository.get_clothes_by_id(clo_idx)
    if not clothes_item:
        # 옷이 없을 경우 404 에러 반환
        raise HTTPException(status_code=404, detail="옷을 찾을 수 없습니다.")
    # 해당 옷 정보를 데이터베이스에서 삭제
    repository.delete_clothes(clo_idx)
    return
