# api/clothes.py

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Request # Request 추가
from typing import List, Optional
from database.repository import ClothesRepository
from schema.response import ClothesSchema, ClothesListSchema
import os
import uuid
import logging
from datetime import datetime
import imghdr
import aiofiles

router = APIRouter(
    prefix="/clothes",
    tags=["Clothes"],
)

# 수정: 업로드 디렉토리를 환경 변수로 가져옴
UPLOAD_DIR = os.getenv("UPLOAD_DIR_CLOTHES", "uploads/clothes")

# 디렉토리가 존재하지 않으면 생성
os.makedirs(UPLOAD_DIR, exist_ok=True)

logger = logging.getLogger(__name__)  # 기존: 로깅 설정 제거

@router.get("/", response_model=ClothesListSchema, summary="모든 옷 목록 조회", description="모든 옷의 정보를 조회합니다.")
async def get_clothes(repository: ClothesRepository = Depends()):  # 수정: async로 변경
    clothes = repository.get_clothes()
    return ClothesListSchema(clothes=[ClothesSchema.model_validate(clothe) for clothe in clothes])

@router.get("/{clo_idx}", response_model=ClothesSchema, summary="특정 옷 정보 조회", description="특정 옷의 상세 정보를 조회합니다.")
async def get_clothes_item(clo_idx: int, request: Request, repository: ClothesRepository = Depends()):  # 수정: async 및 Request 추가
    clothes_item = repository.get_clothes_by_id(clo_idx)
    if not clothes_item:
        raise HTTPException(status_code=404, detail="옷을 찾을 수 없습니다.")
    # 수정: clo_img1_url 설정
    clothes_schema = ClothesSchema.model_validate(clothes_item)
    clothes_schema.clo_img1_url = f"{request.base_url}files/clothes/{os.path.basename(clothes_item.clo_img1)}"  # 수정: URL 설정
    return clothes_schema

@router.post("/", response_model=ClothesSchema, summary="옷 생성", description="새로운 옷을 생성합니다.")
async def create_clothes(
    request: Request,  # 수정: Request 추가하여 base_url 사용
    clo_name: str = Form(...),
    clo_desc: str = Form(...),
    clo_price: int = Form(...),
    clo_3d: Optional[str] = Form(None),
    clo_img1: UploadFile = File(...),  # 이미지 파일 업로드
    repository: ClothesRepository = Depends()
):
    # 파일 유효성 검사 (예: 이미지 확장자)
    allowed_extensions = ('.png', '.jpg', '.jpeg', '.gif')
    if not clo_img1.filename.lower().endswith(allowed_extensions):
        raise HTTPException(status_code=400, detail="허용되지 않는 파일 형식입니다.")

    # MIME 타입 검증
    try:
        contents = await clo_img1.read(512)  # 비동기 읽기
        img_type = imghdr.what(None, h=contents)
        if img_type not in ['png', 'jpeg', 'gif']:
            raise HTTPException(status_code=400, detail="유효하지 않은 이미지 파일입니다.")
    finally:
        await clo_img1.seek(0)  # 파일 포인터 초기화

    # 고유한 파일명 생성
    unique_filename = f"{uuid.uuid4()}_{os.path.basename(clo_img1.filename)}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    # 파일 저장 (비동기)
    try:
        async with aiofiles.open(file_path, 'wb') as out_file:
            while content := await clo_img1.read(1024):  # 비동기 읽기
                await out_file.write(content)
        logger.info(f"파일 저장 성공: {file_path}")
    except Exception as e:
        logger.error(f"파일 저장 중 오류 발생: {e}")
        raise HTTPException(status_code=500, detail="파일 저장에 실패했습니다.")

    # 옷 생성 데이터 준비
    clothes_data = {
        "clo_name": clo_name,
        "clo_desc": clo_desc,
        "clo_price": clo_price,
        "clo_3d": clo_3d,
        "clo_img1": file_path,
        "created_at": datetime.utcnow(),
    }

    # 옷 생성
    clothes_item = repository.create_clothes(clothes_data)

    # 응답 모델에 URL 추가
    base_url = str(request.base_url)
    clothes_schema = ClothesSchema.model_validate(clothes_item)
    clothes_schema.clo_img1_url = f"{base_url}files/clothes/{unique_filename}"  # 수정: URL 설정
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
        if not clo_img1.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
            raise HTTPException(status_code=400, detail="허용되지 않는 파일 형식입니다.")
        
        # 고유한 파일명 생성
        unique_filename = f"{uuid.uuid4()}_{os.path.basename(clo_img1.filename)}"  # 수정: os.path.basename 사용
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        # 파일 저장 (비동기)
        try:
            async with aiofiles.open(file_path, 'wb') as buffer:
                while content := await clo_img1.read(1024):
                    await buffer.write(content)
            logger.info(f"파일 저장 성공: {file_path}")
        except Exception as e:
            logger.error(f"파일 저장 중 오류 발생: {e}")
            raise HTTPException(status_code=500, detail="파일 저장에 실패했습니다.")
        
        # 기존 파일 삭제 (선택 사항)
        if clothes_item.clo_img1 and os.path.exists(clothes_item.clo_img1):
            try:
                os.remove(clothes_item.clo_img1)
                logger.info(f"기존 파일 삭제 성공: {clothes_item.clo_img1}")
            except Exception as e:
                logger.error(f"기존 파일 삭제 중 오류 발생: {e}")
        
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

    # 응답 모델에 URL 추가
    base_url = str(request.base_url)
    clothes_schema = ClothesSchema.model_validate(updated_clothes)
    if clo_img1:
        clothes_schema.clo_img1_url = f"{base_url}files/clothes/{unique_filename}"  # 수정: URL 설정
    else:
        clothes_schema.clo_img1_url = f"{base_url}files/clothes/{os.path.basename(updated_clothes.clo_img1)}"  # 수정: URL 설정
    return clothes_schema

@router.delete("/{clo_idx}", status_code=204, summary="옷 삭제", description="특정 옷을 삭제합니다.")
async def delete_clothes(clo_idx: int, repository: ClothesRepository = Depends()):
    clothes_item = repository.get_clothes_by_id(clo_idx)
    if not clothes_item:
        raise HTTPException(status_code=404, detail="옷을 찾을 수 없습니다.")
    
    # 이미지 파일 삭제
    try:
        if clothes_item.clo_img1 and os.path.exists(clothes_item.clo_img1):
            os.remove(clothes_item.clo_img1)
            logger.info(f"이미지 파일 삭제 성공: {clothes_item.clo_img1}")
    except Exception as e:
        logger.error(f"파일 삭제 중 오류 발생: {e}")
        raise HTTPException(status_code=500, detail="파일 삭제에 실패했습니다.")
    
    # 옷 삭제
    repository.delete_clothes(clo_idx)
    logger.info(f"옷 삭제 성공: clo_idx={clo_idx}")
    return
