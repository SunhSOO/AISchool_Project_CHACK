# utils/file_utils.py
import os
import logging
from fastapi import HTTPException, UploadFile  # UploadFile 추가
import imghdr
import uuid
import aiofiles


logger = logging.getLogger(__name__)

def validate_image_file(upload_file: UploadFile):
    allowed_extensions = ('.png', '.jpg', '.jpeg', '.gif')
    if not upload_file.filename.lower().endswith(allowed_extensions):
        raise HTTPException(status_code=400, detail="허용되지 않는 파일 형식입니다.")

    try:
        contents = upload_file.file.read(512)
        img_type = imghdr.what(None, h=contents)
        if img_type not in ['png', 'jpeg', 'gif']:
            raise HTTPException(status_code=400, detail="유효하지 않은 이미지 파일입니다.")
    finally:
        upload_file.file.seek(0)

def generate_unique_filename(original_filename: str) -> str:
    return f"{uuid.uuid4()}_{os.path.basename(original_filename)}"

async def save_upload_file(upload_file: UploadFile, destination: str):
    try:
        async with aiofiles.open(destination, 'wb') as out_file:
            while content := await upload_file.read(1024):
                await out_file.write(content)
        logger.info(f"파일 저장 성공: {destination}")
    except Exception as e:
        logger.error(f"파일 저장 중 오류 발생: {e}")
        raise HTTPException(status_code=500, detail="파일 저장에 실패했습니다.")
