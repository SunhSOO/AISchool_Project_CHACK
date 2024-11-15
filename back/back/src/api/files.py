# api/files.py

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
import os

router = APIRouter(
    prefix="/files",
    tags=["Files"],
)

UPLOAD_DIR_AVATARS = os.getenv("UPLOAD_DIR_AVATARS", "uploads/avatars")
UPLOAD_DIR_CLOTHES = os.getenv("UPLOAD_DIR_CLOTHES", "uploads/clothes")
UPLOAD_DIR_CLOTHES_3D = os.getenv("UPLOAD_DIR_CLOTHES_3D", "uploads/clothes/3d")

def secure_filename(filename: str) -> str:
    return os.path.basename(filename)  # 변경: 파일 이름을 안전하게 처리

@router.get("/avatars/images/{filename}", response_class=FileResponse, summary="유저 2D 이미지 조회")
async def get_user_image(filename: str):
    filename = secure_filename(filename)
    file_path = os.path.join(UPLOAD_DIR_AVATARS, "images", filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="파일을 찾을 수 없습니다.")
    return FileResponse(file_path)

@router.get("/avatars/models/{filename}", response_class=FileResponse, summary="3D 아바타 모델 조회")
async def get_avatar_model(filename: str):
    filename = secure_filename(filename)
    file_path = os.path.join(UPLOAD_DIR_AVATARS, "models", filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="파일을 찾을 수 없습니다.")
    return FileResponse(file_path)

@router.get("/clothes/{filename}", response_class=FileResponse, summary="옷 이미지 조회")
async def get_clothes_image(filename: str):
    filename = secure_filename(filename)
    file_path = os.path.join(UPLOAD_DIR_CLOTHES, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="파일을 찾을 수 없습니다.")
    return FileResponse(file_path)

@router.get("/clothes/3d/{filename}", response_class=FileResponse, summary="옷 3D 파일 조회")
async def get_clothes_3d_file(filename: str):
    filename = secure_filename(filename)
    file_path = os.path.join(UPLOAD_DIR_CLOTHES_3D, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="파일을 찾을 수 없습니다.")
    return FileResponse(file_path)
