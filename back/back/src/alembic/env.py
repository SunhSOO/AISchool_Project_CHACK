# alembic/env.py
import os
from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

# ORM 모델 임포트
import sys
# 두 단계 상위 디렉토리를 sys.path에 추가하여 'database.orm' 모듈을 임포트할 수 있도록 함
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))  # 수정: 두 단계 상위로 경로 변경
from database.orm import Base  # 수정: ORM Base 임포트

# .env 파일 로드
from dotenv import load_dotenv

# .env 파일의 경로를 명시적으로 설정 (두 단계 상위 디렉토리에 위치)
env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '.env'))
load_dotenv(dotenv_path=env_path, override=True)  # 수정: 중복 호출 제거하고, override=True로 설정

# Alembic Config 객체
config = context.config

# 로그 설정
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# target_metadata을 Base.metadata으로 설정
target_metadata = Base.metadata

# DATABASE_URL 가져오기
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL 환경 변수가 설정되지 않았습니다.")  # 수정: 에러 메시지 명확화

# config에 DATABASE_URL 설정
config.set_main_option("sqlalchemy.url", DATABASE_URL)

def run_migrations_offline() -> None:
    """오프라인 모드에서 마이그레이션 실행."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """온라인 모드에서 마이그레이션 실행."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
