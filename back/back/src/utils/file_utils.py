# utils/file_utils.py
import os
import logging
from fastapi import HTTPException, UploadFile  # UploadFile 추가
import imghdr
import uuid
import aiofiles
from PIL import Image

logger = logging.getLogger(__name__)

def delete_file(file_path: str):
    if file_path and os.path.exists(file_path):
        try:
            os.remove(file_path)
            logger.info(f"파일 삭제 성공: {file_path}")
        except FileNotFoundError:
            logger.warning(f"파일을 찾을 수 없습니다: {file_path}")
        except Exception as e:
            logger.error(f"파일 삭제 중 오류 발생: {e}")
            raise HTTPException(status_code=500, detail="파일 삭제에 실패했습니다.")

def validate_image_file(upload_file: UploadFile):
    try:
        # 파일 포인터를 처음으로 이동
        upload_file.file.seek(0)
        image = Image.open(upload_file.file)
        image.verify()  # 이미지 파일 유효성 검증
        upload_file.file.seek(0)  # 파일 포인터 초기화
    except (IOError, SyntaxError) as e:
        raise HTTPException(status_code=400, detail="유효하지 않은 이미지 파일입니다.")

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
