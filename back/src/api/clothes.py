# api/clothes.py

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Request # Request 추가
from typing import List, Optional
from database.repository import ClothesRepository
from schema.response import ClothesSchema, ClothesListSchema
import os
import uuid
import logging
from datetime import datetime
from utils.file_utils import validate_image_file, generate_unique_filename, save_upload_file, delete_file

router = APIRouter(
    prefix="/clothes",
    tags=["Clothes"],
)

# 수정: 업로드 디렉토리를 환경 변수로 가져옴
UPLOAD_DIR = os.getenv("UPLOAD_DIR_CLOTHES", "uploads/clothes")

# 디렉토리가 존재하지 않으면 생성
os.makedirs(UPLOAD_DIR, exist_ok=True)

logger = logging.getLogger(__name__)  

def create_clothes_url(request: Request, clo_img1_path: Optional[str]) -> Optional[str]:
    if clo_img1_path:
        return f"{request.base_url}files/clothes/{os.path.basename(clo_img1_path)}"
    return None

@router.get("/", response_model=ClothesListSchema, summary="모든 옷 목록 조회", description="모든 옷의 정보를 조회합니다.")
async def get_clothes(request: Request, repository: ClothesRepository = Depends()):
    clothes = repository.get_clothes()
    clothes_list = []
    for clothe in clothes:
        clothes_schema = ClothesSchema.model_validate(clothe)
        clothes_schema.clo_img1_url = create_clothes_url(request, clothe.clo_img1)
        clothes_list.append(clothes_schema)
    return ClothesListSchema(clothes=clothes_list)

@router.get("/{clo_idx}", response_model=ClothesSchema, summary="특정 옷 정보 조회", description="특정 옷의 상세 정보를 조회합니다.")
async def get_clothes_item(clo_idx: int, request: Request, repository: ClothesRepository = Depends()):
    clothes_item = repository.get_clothes_by_id(clo_idx)
    if not clothes_item:
        raise HTTPException(status_code=404, detail="옷을 찾을 수 없습니다.")
    clothes_schema = ClothesSchema.model_validate(clothes_item)
    clothes_schema.clo_img1_url = create_clothes_url(request, clothes_item.clo_img1)
    return clothes_schema

@router.post("/", response_model=ClothesSchema, summary="옷 생성", description="새로운 옷을 생성합니다.")
async def create_clothes(
    request: Request,
    clo_name: str = Form(...),
    clo_desc: str = Form(...),
    clo_price: int = Form(...),
    clo_3d: Optional[str] = Form(None),
    clo_img1: UploadFile = File(...),
    repository: ClothesRepository = Depends()
):
    validate_image_file(clo_img1)

    unique_filename = generate_unique_filename(clo_img1.filename)
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    await save_upload_file(clo_img1, file_path)

    clothes_data = {
        "clo_name": clo_name,
        "clo_desc": clo_desc,
        "clo_price": clo_price,
        "clo_3d": clo_3d,
        "clo_img1": file_path,
        "created_at": datetime.utcnow(),
    }

    clothes_item = repository.create_clothes(clothes_data)

    clothes_schema = ClothesSchema.model_validate(clothes_item)
    clothes_schema.clo_img1_url = create_clothes_url(request, file_path)
    return clothes_schema

@router.patch("/{clo_idx}", response_model=ClothesSchema, summary="옷 정보 수정", description="특정 옷의 정보를 수정합니다.")
async def update_clothes(
    request: Request,  # 수정: Request 추가하여 base_url 사용
    clo_idx: int,
    clo_name: Optional[str] = Form(None),
    clo_desc: Optional[str] = Form(None),
    clo_price: Optional[int] = Form(None),
    clo_3d: Optional[str] = Form(None),
    clo_img1: Optional[UploadFile] = File(None),  # 파일 업로드는 선택 사항으로 변경
    repository: ClothesRepository = Depends()
):
    clothes_item = repository.get_clothes_by_id(clo_idx)
    if not clothes_item:
        raise HTTPException(status_code=404, detail="옷을 찾을 수 없습니다.")
    
    # 파일이 업로드된 경우 처리
    if clo_img1:
        # 파일 유효성 검사
        validate_image_file(clo_img1)
        # 고유한 파일명 생성
        unique_filename = generate_unique_filename(clo_img1.filename)  # 수정: os.path.basename 사용
        file_path = os.path.join(UPLOAD_DIR, unique_filename)

        # 파일 저장 (비동기)
        await save_upload_file(clo_img1, file_path)
        
        # 기존 파일 삭제 (선택 사항)
        delete_file(clothes_item.clo_img1)
        
        # 옷의 이미지 경로 업데이트
        clothes_item.clo_img1 = file_path
    
    # 다른 필드 업데이트
    if clo_name is not None:
        clothes_item.clo_name = clo_name
    if clo_desc is not None:
        clothes_item.clo_desc = clo_desc
    if clo_price is not None:
        clothes_item.clo_price = clo_price
    if clo_3d is not None:
        clothes_item.clo_3d = clo_3d
    
    # 옷 업데이트
    updated_clothes = repository.update_clothes(clothes_item)

    clothes_schema = ClothesSchema.model_validate(updated_clothes)
    if clo_img1:
        clothes_schema.clo_img1_url = create_clothes_url(request, file_path)
    else:
        clothes_schema.clo_img1_url = create_clothes_url(request, updated_clothes.clo_img1)
    return clothes_schema

@router.delete("/{clo_idx}", status_code=204, summary="옷 삭제", description="특정 옷을 삭제합니다.")
async def delete_clothes(clo_idx: int, repository: ClothesRepository = Depends()):
    clothes_item = repository.get_clothes_by_id(clo_idx)
    if not clothes_item:
        raise HTTPException(status_code=404, detail="옷을 찾을 수 없습니다.")
    
    delete_file(clothes_item.clo_img1)

    repository.delete_clothes(clo_idx)
    return


'''clo_img1_url 필드의 타입이 AnyUrl로 되어 있다면,
URL 검증 과정에서 예상치 못한 문제가 발생할 수 있습니다. 
이를 Optional[str]로 변경하여 문제를 방지할 수 있습니다.
'''