# main.py

import logging
from fastapi import FastAPI, Request, HTTPException  # HTTPException 추가
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from api import clothes, user, avatar, fitting, files
from dotenv import load_dotenv
import os

# .env 파일 로드 (가장 먼저 실행)
load_dotenv()

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

app = FastAPI()

# CORS 설정
origins_str = os.getenv("ALLOWED_ORIGINS", "")
origins = [origin.strip() for origin in origins_str.split(",")] if origins_str else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(clothes.router)
app.include_router(user.router)
app.include_router(avatar.router)
app.include_router(fitting.router)
app.include_router(files.router)

@app.get("/")
async def health_check_handler():  # 수정: async로 변경
    logger.info("Health check called")
    return {"ping": "pong"}

# 추가: 글로벌 에러 핸들러
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    logger.error(f"HTTP error occurred: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )
