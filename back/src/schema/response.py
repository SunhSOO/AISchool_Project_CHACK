# schema/response.py

from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional
from pydantic import ConfigDict

class ClothesSchema(BaseModel):
    clo_idx: int
    clo_name: str
    clo_desc: str
    clo_price: int
    clo_img: str  # 추가된 필드
    clo_3d: Optional[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ClothesListSchema(BaseModel):
    clothes: List[ClothesSchema]

class UserSchema(BaseModel):
    user_id: str
    user_name: str
    user_email: EmailStr
    joined_at: datetime

    model_config = ConfigDict(from_attributes=True)

# Avatar 및 Fitting 응답 모델 추가
class AvatarSchema(BaseModel):
    avatar_idx: int
    user_id: str
    avatar_path: Optional[str]
    img_rname: str
    img_size: int
    img_ext: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class FittingSchema(BaseModel):
    fitting_idx: int
    avatar_idx: int
    clo_idx: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
