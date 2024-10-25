# tests/test_db_connection.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)

try:
    session = Session()
    session.execute("SELECT 1")
    print("데이터베이스 연결 성공.")
except Exception as e:
    print(f"데이터베이스 연결 실패: {e}")
finally:
    session.close()
