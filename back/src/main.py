# main.py

import logging
from fastapi import FastAPI
from api import clothes, user, avatar, fitting  # 새로운 라우터 임포트

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()
app.include_router(clothes.router)
app.include_router(user.router)
app.include_router(avatar.router)   # 새로운 라우터 추가
app.include_router(fitting.router)  # 새로운 라우터 추가

@app.get("/")
def health_check_handler():
    logger.info("Health check called")
    return {"ping": "pong"}