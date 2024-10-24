import logging
from fastapi import FastAPI
from api import clothes, user, avatar, fitting  # API 모듈로부터 라우터 임포트

# 로깅 설정
# 애플리케이션에서 정보를 기록할 수 있도록 로깅을 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# FastAPI 애플리케이션 인스턴스 생성
app = FastAPI()
# 옷(clothes) 관련 API 라우터 등록
app.include_router(clothes.router)
# 사용자(user) 관련 API 라우터 등록
app.include_router(user.router)
# 아바타(avatar) 관련 API 라우터 등록
app.include_router(avatar.router)  
# 피팅(fitting) 관련 API 라우터 등록
app.include_router(fitting.router) 

# 헬스 체크 엔드포인트
# 이 엔드포인트는 서버가 정상적으로 작동하는지 확인하는 용도로 사용
@app.get("/")
def health_check_handler():
    # 헬스 체크 요청이 들어오면 로그를 남김
    logger.info("Health check called")
    # 서버 상태를 나타내는 JSON 응답 반환
    return {"ping": "pong"}

