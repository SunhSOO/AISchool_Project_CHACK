# schema/request.py

from pydantic import BaseModel, EmailStr
from typing import Optional

class CreateClothesRequest(BaseModel):
    clo_name: str
    clo_desc: str
    clo_price: int
    clo_3d: Optional[str] = None

class SignUpRequest(BaseModel):
    user_id: str
    user_name: str
    password: str
    user_email: EmailStr

class LogInRequest(BaseModel):
    user_id: str
    password: str

# Avatar 및 Fitting 요청 모델 추가
class CreateAvatarRequest(BaseModel):
    user_id: str
    avatar_path: Optional[str] = None
    img_rname: str
    img_size: int
    img_ext: str

class CreateFittingRequest(BaseModel):
    avatar_idx: int
    clo_idx: int
