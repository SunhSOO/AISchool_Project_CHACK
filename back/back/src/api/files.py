# api/files.py

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
import os

router = APIRouter(
    prefix="/files",
    tags=["Files"],
)

def secure_filename(filename: str) -> str:
    return os.path.basename(filename)  # 변경: 파일 이름을 안전하게 처리

@router.get("/avatars/images/{filename}", response_class=FileResponse)
async def get_user_image(filename: str):
    filename = secure_filename(filename)  # 변경: 파일 이름 보안 처리
    file_path = os.path.join("uploads/avatars/images", filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="파일을 찾을 수 없습니다.")
    return FileResponse(file_path)

@router.get("/clothes/{filename}", response_class=FileResponse)
async def get_clothes_image(filename: str):
    filename = secure_filename(filename)  # 변경: 파일 이름 보안 처리
    file_path = os.path.join("uploads/clothes", filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="파일을 찾을 수 없습니다.")
    return FileResponse(file_path)

@router.get("/avatars/models/{filename}", response_class=FileResponse)
async def get_avatar_model(filename: str):
    filename = secure_filename(filename)  # 변경: 파일 이름 보안 처리
    file_path = os.path.join("uploads/avatars/models", filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="파일을 찾을 수 없습니다.")
    return FileResponse(file_path)