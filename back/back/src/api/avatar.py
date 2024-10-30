# api/avatar.py

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Request
from typing import List, Optional
from database.repository import AvatarRepository, UserRepository
from schema.response import AvatarSchema
from datetime import datetime
from database.orm import Avatar
import os
import uuid
import logging
from security import get_current_user  # 추가
from utils.file_utils import validate_image_file, generate_unique_filename, save_upload_file, delete_file
from utils.avatar_utils import generate_3d_avatar  # 추가
from database.orm import User

router = APIRouter(
    prefix="/avatars",
    tags=["Avatars"],
)

UPLOAD_DIR_AVATARS = os.getenv("UPLOAD_DIR_AVATARS", "uploads/avatars")  # 변경: 환경 변수로 업로드 디렉토리 설정

IMAGE_DIR = os.path.join(UPLOAD_DIR_AVATARS, "images")    # 2D 이미지 파일 디렉토리
MODEL_DIR = os.path.join(UPLOAD_DIR_AVATARS, "models")    # 3D 아바타 파일 디렉토리

# 디렉토리가 존재하지 않으면 생성
os.makedirs(IMAGE_DIR, exist_ok=True)
os.makedirs(MODEL_DIR, exist_ok=True)

logger = logging.getLogger(__name__)

@router.get("/", response_model=List[AvatarSchema], summary="사용자 아바타 목록 조회", description="특정 사용자의 모든 아바타를 조회합니다.")
async def get_avatars(request: Request, current_user: User = Depends(get_current_user), repository: AvatarRepository = Depends()):
    avatars = repository.get_avatars_by_user_id(current_user.user_id)
    # Set URLs for each avatar
    return [
        AvatarSchema.model_validate(avatar).model_copy(update={
            "img_url": f"{request.base_url}files/avatars/images/{os.path.basename(avatar.img_path)}",
            "avatar_url": f"{request.base_url}files/avatars/models/{os.path.basename(avatar.avatar_path)}" if avatar.avatar_path else None
        }) 
        for avatar in avatars
    ]

@router.post("/", response_model=AvatarSchema, summary="아바타 생성", description="새로운 아바타를 생성합니다.")
async def create_avatar(
    request: Request,  # 수정: Request 추가
    height: Optional[int] = Form(None),
    weight: Optional[int] = Form(None),
    chest_circumference: Optional[float] = Form(None),
    waist_circumference: Optional[float] = Form(None),
    hip_circumference: Optional[float] = Form(None),
    img_file: UploadFile = File(...),  # 업로드된 2D 이미지 파일
    repository: AvatarRepository = Depends(),
    user_repository: UserRepository = Depends(),
    current_user: User = Depends(get_current_user)  # 추가
):
    user_id = current_user.user_id
    # 파일 유효성 검사
    validate_image_file(img_file)

    # 고유한 파일명 생성
    unique_filename = generate_unique_filename(img_file.filename)
    file_path = os.path.join(IMAGE_DIR, unique_filename)

    # 파일 저장 (비동기)
    await save_upload_file(img_file, file_path)

    # 3D 아바타 파일 생성
    avatar_filename = f"{uuid.uuid4()}_avatar.obj"
    avatar_file_path = os.path.join(MODEL_DIR, avatar_filename)
    await generate_3d_avatar(file_path, avatar_file_path)

    # 아바타 생성 데이터 준비
    avatar_data = {
        "user_id": user_id,
        "img_rname": os.path.basename(img_file.filename),  # 원본 파일명 저장
        "img_path": file_path,           # 업로드된 2D 이미지 파일 경로
        "img_size": os.path.getsize(file_path),
        "img_ext": os.path.splitext(img_file.filename)[1],
        "avatar_path": avatar_file_path,  # 생성된 3D 파일 경로
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

    # 응답 모델에 URL 추가
    base_url = str(request.base_url)
    avatar_schema = AvatarSchema.model_validate(avatar)
    avatar_schema.img_url = f"{base_url}files/avatars/images/{unique_filename}"  # 수정: URL 설정
    avatar_schema.avatar_url = f"{base_url}files/avatars/models/{avatar_filename}"  # 수정: URL 설정
    return avatar_schema

@router.patch("/{avatar_idx}", response_model=AvatarSchema, summary="아바타 정보 수정", description="특정 아바타의 정보를 수정합니다.")
async def update_avatar(
    request: Request,  # 수정: Request 추가
    avatar_idx: int,
    height: Optional[int] = Form(None),
    weight: Optional[int] = Form(None),
    chest_circumference: Optional[float] = Form(None),
    waist_circumference: Optional[float] = Form(None),
    hip_circumference: Optional[float] = Form(None),
    img_file: Optional[UploadFile] = File(None),  # 업로드된 2D 이미지 파일
    repository: AvatarRepository = Depends(),
    current_user: User = Depends(get_current_user)  # 추가
):
    avatar = repository.get_avatar_by_id(avatar_idx)
    if not avatar or avatar.user_id != current_user.user_id:
        raise HTTPException(status_code=404, detail="아바타를 찾을 수 없습니다.")

    # 파일이 업로드된 경우 처리
    if img_file:
        # 파일 유효성 검사
        validate_image_file(img_file)

        # 고유한 파일명 생성
        unique_filename = generate_unique_filename(img_file.filename)
        file_path = os.path.join(IMAGE_DIR, unique_filename)

        # 파일 저장 (비동기)
        await save_upload_file(img_file, file_path)

        # 3D 아바타 파일 생성
        avatar_filename = f"{uuid.uuid4()}_avatar.obj"
        avatar_file_path = os.path.join(MODEL_DIR, avatar_filename)
        await generate_3d_avatar(file_path, avatar_file_path)

        # 기존 파일 삭제
        delete_file(avatar.img_path)
        delete_file(avatar.avatar_path)

        # 아바타의 이미지 정보 업데이트
        avatar.img_path = file_path
        avatar.img_rname = os.path.basename(img_file.filename)
        avatar.img_size = os.path.getsize(file_path)
        avatar.img_ext = os.path.splitext(img_file.filename)[1]
        avatar.avatar_path = avatar_file_path

    # 다른 필드 업데이트
    if height is not None:
        avatar.height = height
    if weight is not None:
        avatar.weight = weight
    if chest_circumference is not None:
        avatar.chest_circumference = chest_circumference
    if waist_circumference is not None:
        avatar.waist_circumference = waist_circumference
    if hip_circumference is not None:
        avatar.hip_circumference = hip_circumference

    # 아바타 업데이트
    updated_avatar = repository.update_avatar(avatar)

    # 응답 모델에 URL 추가
    base_url = str(request.base_url)
    avatar_schema = AvatarSchema.model_validate(updated_avatar)
    if img_file:
        avatar_schema.img_url = f"{base_url}files/avatars/images/{unique_filename}"  # 수정: URL 설정
        avatar_schema.avatar_url = f"{base_url}files/avatars/models/{avatar_filename}"  # 수정: URL 설정
    else:
        avatar_schema.img_url = f"{base_url}files/avatars/images/{os.path.basename(updated_avatar.img_path)}"  # 수정: URL 설정
        avatar_schema.avatar_url = f"{base_url}files/avatars/models/{os.path.basename(updated_avatar.avatar_path)}" if updated_avatar.avatar_path else None
    return avatar_schema

@router.delete("/{avatar_idx}", status_code=204, summary="아바타 삭제", description="특정 아바타를 삭제합니다.")
async def delete_avatar(avatar_idx: int, repository: AvatarRepository = Depends(), current_user: User = Depends(get_current_user)):
    avatar = repository.get_avatar_by_id(avatar_idx)
    if not avatar or avatar.user_id != current_user.user_id:
        raise HTTPException(status_code=404, detail="아바타를 찾을 수 없습니다.")

    # 이미지 파일 삭제
    delete_file(avatar.img_path)

    # 아바타 파일 삭제 (3D 모델 파일)
    delete_file(avatar.avatar_path)

    # 아바타 삭제
    repository.delete_avatar(avatar_idx)
    return