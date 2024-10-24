from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# 데이터베이스 URL 설정 (MySQL)
# 형식: "mysql+pymysql://<username>:<password>@<host>:<port>/<database_name>"
DATABASE_URL = "mysql+pymysql://root:1234@127.0.0.1:3306/chack"  # 필요에 따라 수정

# SQLAlchemy 엔진 생성
# 데이터베이스와 상호작용할 수 있는 엔진을 생성합니다.
engine = create_engine(DATABASE_URL)

# 세션 팩토리 생성
# 데이터베이스 세션을 관리할 수 있는 팩토리를 생성합니다.
# autocommit=False: 세션이 자동으로 커밋되지 않도록 설정
# autoflush=False: 세션이 자동으로 flush 되지 않도록 설정
SessionFactory = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 데이터베이스 세션을 생성하고 반환하는 함수
# FastAPI에서 이 함수를 사용해 의존성 주입 방식으로 세션을 주입받습니다.
def get_db():
    session = SessionFactory()  # 새로운 세션 생성
    try:
        yield session  # 세션을 반환
    finally:
        session.close()  # 작업이 끝난 후 세션을 닫음

