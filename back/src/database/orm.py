# database/orm.py

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, TIMESTAMP, Float
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "tb_user"
    user_id = Column(String(50), primary_key=True, index=True, comment='사용자 아이디')
    user_pw = Column(String(100), nullable=False, comment='사용자 비밀번호')
    user_name = Column(String(50), nullable=False, index=True, comment='사용자 이름')
    user_email = Column(String(50), nullable=False, unique=True, comment='사용자 이메일')
    joined_at = Column(TIMESTAMP, nullable=False, default=datetime.utcnow, comment='가입 일자')

    avatars = relationship("Avatar", back_populates="user")

    def __repr__(self):
        return f"User(user_id={self.user_id}, user_name={self.user_name})"

    @classmethod
    def create(cls, user_id: str, user_name: str, hashed_password: str, user_email: str) -> "User":
        return cls(
            user_id=user_id,
            user_pw=hashed_password,
            user_name=user_name,
            user_email=user_email,
            joined_at=datetime.utcnow(),
        )

class Clothes(Base):
    __tablename__ = "tb_clothes"
    clo_idx = Column(Integer, primary_key=True, autoincrement=True, comment='옷 식별자')
    clo_name = Column(String(100), nullable=False, index=True, comment='옷 제품명')
    clo_desc = Column(Text, nullable=False, comment='옷 설명')
    clo_price = Column(Integer, nullable=False, comment='옷 가격')
    clo_3d = Column(String(1000), nullable=True, comment='옷 3D 이미지')
    clo_img1 = Column(String(1000), nullable=False, comment='옷 사진1')  # **새로운 필드 추가**
    created_at = Column(TIMESTAMP, nullable=False, default=datetime.utcnow, comment='등록 일자')

    fittings = relationship("Fitting", back_populates="clothes")

    def __repr__(self):
        return f"Clothes(clo_idx={self.clo_idx}, clo_name={self.clo_name}, clo_price={self.clo_price})"

    @classmethod
    def create(cls, request):
        return cls(
            clo_name=request.clo_name,
            clo_desc=request.clo_desc,
            clo_price=request.clo_price,
            clo_3d=request.clo_3d,
            clo_img1=request.clo_img1,  # **새로운 필드 추가**
            created_at=datetime.utcnow(),
        )

class Avatar(Base):
    __tablename__ = "tb_avartar"
    avatar_idx = Column(Integer, primary_key=True, autoincrement=True, comment='아바타 식별자')
    user_id = Column(String(50), ForeignKey("tb_user.user_id", ondelete="RESTRICT", onupdate="RESTRICT"), nullable=False, comment='사용자 아이디')
    avatar_path = Column(String(1000), nullable=True, comment='아바타 경로')
    img_rname = Column(String(10000), nullable=False, comment='유저 사진')
    img_size = Column(Integer, nullable=False, default=0, comment='사진 사이즈')
    img_ext = Column(String(10), nullable=False, comment='사진 확장자')
    created_at = Column(TIMESTAMP, nullable=False, default=datetime.utcnow, comment='등록 일자')
    height = Column(Integer, nullable=True, comment='신장')  # **새로운 컬럼 추가**
    weight = Column(Integer, nullable=True, comment='체중')  # **새로운 컬럼 추가**
    chest_circumference = Column(Float, nullable=True, comment='가슴둘레')  # **새로운 컬럼 추가**
    waist_circumference = Column(Float, nullable=True, comment='허리둘레')  # **새로운 컬럼 추가**
    hip_circumference = Column(Float, nullable=True, comment='엉덩이둘레')  # **새로운 컬럼 추가**
    user = relationship("User", back_populates="avatars")
    fittings = relationship("Fitting", back_populates="avatar")

    def __repr__(self):
        return f"Avatar(avatar_idx={self.avatar_idx}, user_id={self.user_id})"

class Fitting(Base):
    __tablename__ = "tb_fitting"
    fitting_idx = Column(Integer, primary_key=True, autoincrement=True, comment='피팅 식별자')
    avatar_idx = Column(Integer, ForeignKey("tb_avartar.avatar_idx", ondelete="RESTRICT", onupdate="RESTRICT"), nullable=False, comment='아바타 식별자')
    clo_idx = Column(Integer, ForeignKey("tb_clothes.clo_idx", ondelete="RESTRICT", onupdate="RESTRICT"), nullable=False, comment='옷 식별자')
    created_at = Column(TIMESTAMP, nullable=False, default=datetime.utcnow, comment='피팅 날짜')

    avatar = relationship("Avatar", back_populates="fittings")
    clothes = relationship("Clothes")

    def __repr__(self):
        return f"Fitting(fitting_idx={self.fitting_idx}, avatar_idx={self.avatar_idx}, clo_idx={self.clo_idx})"