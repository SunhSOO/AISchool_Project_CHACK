# schema/response.py

from pydantic import BaseModel, EmailStr, AnyUrl
from datetime import datetime
from typing import List, Optional
from pydantic import ConfigDict
from enum import Enum  # Enum 모듈 추가

class Token(BaseModel):
    access_token: str
    token_type: str
    
# 성별을 위한 Enum 클래스 정의
class GenderEnum(str, Enum):
    male = 'M'
    female = 'F'
    
class UserSchema(BaseModel):
    user_id: str
    user_name: str
    user_email: EmailStr
    user_gender: GenderEnum  # 성별 필드 추가
    joined_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ClothesSchema(BaseModel):
    clo_idx: int
    clo_name: str
    clo_desc: str
    clo_price: int
    clo_img1_url: Optional[AnyUrl] = None  # URL로 변경
    clo_3d_url: Optional[AnyUrl] = None  # 추가된 필드
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ClothesListSchema(BaseModel):
    clothes: List[ClothesSchema]

    model_config = ConfigDict(from_attributes=True)

# Avatar 및 Fitting 응답 모델 추가
class AvatarSchema(BaseModel):
    avatar_idx: int
    user_id: str
    avatar_url: Optional[AnyUrl] = None  # URL로 변경
    img_rname: str  # 원본 파일명
    img_url: Optional[AnyUrl] = None  # URL로 변경
    img_size: int
    img_ext: str
    created_at: datetime
    height: Optional[int] = None  # **새로운 필드 추가**
    weight: Optional[int] = None  # **새로운 필드 추가**
    chest_circumference: Optional[float] = None  # **새로운 필드 추가**
    waist_circumference: Optional[float] = None  # **새로운 필드 추가**
    hip_circumference: Optional[float] = None  # **새로운 필드 추가**

    model_config = ConfigDict(from_attributes=True)

class FittingSchema(BaseModel):
    fitting_idx: int
    avatar_idx: int
    clo_idx: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

    