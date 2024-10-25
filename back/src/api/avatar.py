# api/avatar.py

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from typing import List, Optional
from database.repository import AvatarRepository, UserRepository
from schema.response import AvatarSchema
from schema.request import UpdateAvatarRequest
from sqlalchemy.orm import Session
import os
import shutil
import uuid
import logging
from datetime import datetime
from database.orm import Avatar

router = APIRouter(
    prefix="/avatars",
    tags=["Avatars"],
)

UPLOAD_DIR = "uploads/avatars"  # 이미지 파일을 저장할 디렉토리

# 디렉토리가 존재하지 않으면 생성
os.makedirs(UPLOAD_DIR, exist_ok=True)

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)  # 로깅 설정

@router.get("/", response_model=List[AvatarSchema], summary="사용자 아바타 목록 조회", description="특정 사용자의 모든 아바타를 조회합니다.")
def get_avatars(user_id: str, repository: AvatarRepository = Depends()):
    avatars = repository.get_avatars_by_user_id(user_id)
    return [AvatarSchema.model_validate(avatar) for avatar in avatars]

@router.post("/", response_model=AvatarSchema, summary="아바타 생성", description="새로운 아바타를 생성합니다.")
def create_avatar(
    user_id: str = Form(...),
    height: Optional[int] = Form(None),
    weight: Optional[int] = Form(None),
    chest_circumference: Optional[float] = Form(None),
    waist_circumference: Optional[float] = Form(None),
    hip_circumference: Optional[float] = Form(None),
    img_file: UploadFile = File(...),  # 이미지 파일 업로드
    repository: AvatarRepository = Depends(),
    user_repository: UserRepository = Depends()  # UserRepository 추가
):
     # 사용자 존재 여부 확인
    user = user_repository.get_user_by_user_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="해당 user_id를 가진 사용자가 존재하지 않습니다.")
    
    # 파일 유효성 검사 (예: 이미지 확장자)
    allowed_extensions = ('.png', '.jpg', '.jpeg', '.gif')
    if not img_file.filename.lower().endswith(allowed_extensions):
        raise HTTPException(status_code=400, detail="허용되지 않는 파일 형식입니다.")
    
    # 고유한 파일명 생성
    unique_filename = f"{uuid.uuid4()}_{img_file.filename}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    # 파일 저장
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(img_file.file, buffer)
        logger.info(f"파일 저장 성공: {file_path}")
    except Exception as e:
        logger.error(f"파일 저장 중 오류 발생: {e}")
        raise HTTPException(status_code=500, detail="파일 저장에 실패했습니다.")
    
    # 아바타 생성 데이터 준비
    avatar_data = {
        "user_id": user_id,
        "avatar_path": file_path,
        "img_rname": img_file.filename,  # 원본 파일명 저장
        "img_size": os.path.getsize(file_path),
        "img_ext": os.path.splitext(img_file.filename)[1],
        "height": height,
        "weight": weight,
        "chest_circumference": chest_circumference,
        "waist_circumference": waist_circumference,
        "hip_circumference": hip_circumference,
        "created_at": datetime.utcnow(),
    }
    
    # 아바타 생성
    avatar = Avatar(**avatar_data)
    avatar = repository.create_avatar(avatar)
    return AvatarSchema.model_validate(avatar)

@router.patch("/{avatar_idx}", response_model=AvatarSchema, summary="아바타 정보 수정", description="특정 아바타의 정보를 수정합니다.")
def update_avatar(
    avatar_idx: int,
    avatar_update: UpdateAvatarRequest = Depends(),  # UpdateAvatarRequest 사용
    img_file: Optional[UploadFile] = File(None),  # 파일 업로드는 선택 사항으로 변경
    repository: AvatarRepository = Depends()
):
    avatar = repository.get_avatar_by_id(avatar_idx)
    if not avatar:
        raise HTTPException(status_code=404, detail="아바타를 찾을 수 없습니다.")
    
    # 파일이 업로드된 경우 처리
    if img_file:
        # 파일 유효성 검사
        if not img_file.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
            raise HTTPException(status_code=400, detail="허용되지 않는 파일 형식입니다.")
        
        # 고유한 파일명 생성
        unique_filename = f"{uuid.uuid4()}_{img_file.filename}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        # 파일 저장
        try:
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(img_file.file, buffer)
            logger.info(f"파일 저장 성공: {file_path}")
        except Exception as e:
            logger.error(f"파일 저장 중 오류 발생: {e}")
            raise HTTPException(status_code=500, detail="파일 저장에 실패했습니다.")
        
        # 기존 파일 삭제 (선택 사항)
        if avatar.avatar_path and os.path.exists(avatar.avatar_path):
            try:
                os.remove(avatar.avatar_path)
                logger.info(f"기존 파일 삭제 성공: {avatar.avatar_path}")
            except Exception as e:
                logger.error(f"기존 파일 삭제 중 오류 발생: {e}")
        
        # 아바타의 이미지 경로 업데이트
        avatar.avatar_path = file_path
        avatar.img_rname = img_file.filename
        avatar.img_size = os.path.getsize(file_path)
        avatar.img_ext = os.path.splitext(img_file.filename)[1]
    
    # 다른 필드 업데이트
    if avatar_update.height is not None:
        avatar.height = avatar_update.height
    if avatar_update.weight is not None:
        avatar.weight = avatar_update.weight
    if avatar_update.chest_circumference is not None:
        avatar.chest_circumference = avatar_update.chest_circumference
    if avatar_update.waist_circumference is not None:
        avatar.waist_circumference = avatar_update.waist_circumference
    if avatar_update.hip_circumference is not None:
        avatar.hip_circumference = avatar_update.hip_circumference
    
    # 아바타 업데이트
    updated_avatar = repository.update_avatar(avatar)
    return AvatarSchema.model_validate(updated_avatar)

@router.delete("/{avatar_idx}", status_code=204, summary="아바타 삭제", description="특정 아바타를 삭제합니다.")
def delete_avatar(avatar_idx: int, repository: AvatarRepository = Depends()):
    avatar = repository.get_avatar_by_id(avatar_idx)
    if not avatar:
        raise HTTPException(status_code=404, detail="아바타를 찾을 수 없습니다.")
    
    # 이미지 파일 삭제
    try:
        if avatar.avatar_path and os.path.exists(avatar.avatar_path):
            os.remove(avatar.avatar_path)
            logger.info(f"이미지 파일 삭제 성공: {avatar.avatar_path}")
    except Exception as e:
        logger.error(f"파일 삭제 중 오류 발생: {e}")
        raise HTTPException(status_code=500, detail="파일 삭제에 실패했습니다.")
    
    # 아바타 삭제
    repository.delete_avatar(avatar_idx)
    logger.info(f"아바타 삭제 성공: avatar_idx={avatar_idx}")
    return
