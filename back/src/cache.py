import redis

# Redis 클라이언트 객체 생성
redis_client = redis.Redis(
    host="127.0.0.1",         # Redis 서버의 호스트 주소 (로컬 호스트)
    port=6379,                # Redis 서버의 포트 번호 (기본값: 6379)
    db=0,                     # 사용할 Redis 데이터베이스 (기본값: 0번 DB)
    encoding="UTF-8",         # 데이터 인코딩 방식 (UTF-8)
    decode_responses=True     # Redis 응답을 자동으로 디코딩하여 문자열로 반환
)


# mysql에서 사용하는 redis >> 속도 향상(큰 프로젝트가 아니어서 스킵가능)