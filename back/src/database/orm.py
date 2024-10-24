from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, TIMESTAMP
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime

# SQLAlchemy의 기본 클래스 선언을 위한 베이스 클래스 정의
Base = declarative_base()

# User 클래스: 사용자 정보 테이블(tb_user)에 해당
class User(Base):
    __tablename__ = "tb_user"  # 테이블 이름 설정
    user_id = Column(String(50), primary_key=True, index=True, comment='사용자 아이디')  # 사용자 아이디 (기본키)
    user_pw = Column(String(100), nullable=False, comment='사용자 비밀번호')  # 사용자 비밀번호
    user_name = Column(String(50), nullable=False, index=True, comment='사용자 이름')  # 사용자 이름
    user_email = Column(String(50), nullable=False, unique=True, comment='사용자 이메일')  # 사용자 이메일 (고유)
    joined_at = Column(TIMESTAMP, nullable=False, default=datetime.utcnow, comment='가입 일자')  # 가입 일자, 기본값은 현재 시간

    # User와 Avatar 간의 관계 정의 (User가 여러 개의 Avatar를 가질 수 있음)
    avatars = relationship("Avatar", back_populates="user")

    # 객체를 문자열로 나타낼 때 사용되는 메서드
    def __repr__(self):
        return f"User(user_id={self.user_id}, user_name={self.user_name})"

    # 새로운 사용자 생성 메서드 (클래스 메서드로 정의)
    @classmethod
    def create(cls, user_id: str, user_name: str, hashed_password: str, user_email: str) -> "User":
        return cls(
            user_id=user_id,
            user_pw=hashed_password,  # 비밀번호는 해시화된 값으로 전달
            user_name=user_name,
            user_email=user_email,
            joined_at=datetime.utcnow(),  # 가입 일자는 현재 시간으로 설정
        )

# Clothes 클래스: 의류 정보 테이블(tb_clothes)에 해당
class Clothes(Base):
    __tablename__ = "tb_clothes"  # 테이블 이름 설정
    clo_idx = Column(Integer, primary_key=True, autoincrement=True, comment='옷 식별자')  # 옷 식별자 (자동 증가)
    clo_name = Column(String(100), nullable=False, index=True, comment='옷 제품명')  # 옷 이름
    clo_desc = Column(Text, nullable=False, comment='옷 설명')  # 옷 설명
    clo_price = Column(Integer, nullable=False, comment='옷 가격')  # 옷 가격
    clo_img = Column(String(1000), nullable=False, comment='옷 사진')  # 옷 사진 파일 경로
    clo_3d = Column(String(1000), nullable=True, comment='옷 3D 이미지')  # 3D 이미지 경로 (선택적)
    created_at = Column(TIMESTAMP, nullable=False, default=datetime.utcnow, comment='등록 일자')  # 등록 일자

    def __repr__(self):
        return f"Clothes(clo_idx={self.clo_idx}, clo_name={self.clo_name}, clo_price={self.clo_price})"

    # 새로운 옷 정보 생성 메서드
    @classmethod
    def create(cls, request):
        return cls(
            clo_name=request.clo_name,
            clo_desc=request.clo_desc,
            clo_price=request.clo_price,
            clo_img=request.clo_img,
            clo_3d=request.clo_3d,
            created_at=datetime.utcnow(),  # 등록 일자는 현재 시간으로 설정
        )

# Avatar 클래스: 아바타 정보 테이블(tb_avartar)에 해당
class Avatar(Base):
    __tablename__ = "tb_avartar"  # 테이블 이름 설정
    avatar_idx = Column(Integer, primary_key=True, autoincrement=True, comment='아바타 식별자')  # 아바타 식별자
    user_id = Column(String(50), ForeignKey("tb_user.user_id", ondelete="RESTRICT", onupdate="RESTRICT"), nullable=False, comment='사용자 아이디')  # 사용자 아이디 (외래키)
    avatar_path = Column(String(1000), nullable=True, comment='아바타 경로')  # 아바타 파일 경로
    img_rname = Column(String(10000), nullable=False, comment='유저 사진')  # 사진 이름
    img_size = Column(Integer, nullable=False, default=0, comment='사진 사이즈')  # 사진 크기
    img_ext = Column(String(10), nullable=False, comment='사진 확장자')  # 사진 확장자
    created_at = Column(TIMESTAMP, nullable=False, default=datetime.utcnow, comment='등록 일자')  # 등록 일자

    # Avatar와 User 간의 관계 정의 (Avatar가 하나의 User에 속함)
    user = relationship("User", back_populates="avatars")
    
    # Avatar와 Fitting 간의 관계 정의 (Avatar가 여러 Fitting을 가질 수 있음)
    fittings = relationship("Fitting", back_populates="avatar")

    def __repr__(self):
        return f"Avatar(avatar_idx={self.avatar_idx}, user_id={self.user_id})"

# Fitting 클래스: 피팅 정보 테이블(tb_fitting)에 해당
class Fitting(Base):
    __tablename__ = "tb_fitting"  # 테이블 이름 설정
    fitting_idx = Column(Integer, primary_key=True, autoincrement=True, comment='피팅 식별자')  # 피팅 식별자
    avatar_idx = Column(Integer, ForeignKey("tb_avartar.avatar_idx", ondelete="RESTRICT", onupdate="RESTRICT"), nullable=False, comment='아바타 식별자')  # 아바타 식별자 (외래키)
    clo_idx = Column(Integer, ForeignKey("tb_clothes.clo_idx", ondelete="RESTRICT", onupdate="RESTRICT"), nullable=False, comment='옷 식별자')  # 옷 식별자 (외래키)
    created_at = Column(TIMESTAMP, nullable=False, default=datetime.utcnow, comment='피팅 날짜')  # 피팅 날짜

    # Fitting과 Avatar 간의 관계 정의 (Fitting이 하나의 Avatar에 속함)
    avatar = relationship("Avatar", back_populates="fittings")
    
    # Fitting과 Clothes 간의 관계 정의 (Fitting이 하나의 Clothes를 참조)
    clothes = relationship("Clothes")

    def __repr__(self):
        return f"Fitting(fitting_idx={self.fitting_idx}, avatar_idx={self.avatar_idx}, clo_idx={self.clo_idx})"
