# schema/request.py

from pydantic import BaseModel, EmailStr
from typing import Optional
<<<<<<< HEAD
from pydantic import ConfigDict
=======
>>>>>>> develop

class CreateClothesRequest(BaseModel):
    clo_name: str
    clo_desc: str
    clo_price: int
    clo_3d: Optional[str] = None
<<<<<<< HEAD
    clo_img1: str  # 파일 경로를 저장할 필드

    model_config = ConfigDict(from_attributes=True)

class UpdateClothesRequest(BaseModel):
    clo_name: Optional[str] = None
    clo_desc: Optional[str] = None
    clo_price: Optional[int] = None
    clo_3d: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
=======
>>>>>>> develop

class SignUpRequest(BaseModel):
    user_id: str
    user_name: str
    password: str
    user_email: EmailStr
<<<<<<< HEAD
    
    model_config = ConfigDict(from_attributes=True)
=======
>>>>>>> develop

class LogInRequest(BaseModel):
    user_id: str
    password: str

# Avatar 및 Fitting 요청 모델 추가
class CreateAvatarRequest(BaseModel):
    user_id: str
    avatar_path: Optional[str] = None
<<<<<<< HEAD
    img_rname: Optional[str] = None
    img_size: Optional[int] = 0
    img_ext: Optional[str] = None
    height: Optional[int] = None
    weight: Optional[int] = None
    chest_circumference: Optional[float] = None
    waist_circumference: Optional[float] = None
    hip_circumference: Optional[float] = None
    
    model_config = ConfigDict(from_attributes=True)

class UpdateAvatarRequest(BaseModel):
    height: Optional[int] = None
    weight: Optional[int] = None
    chest_circumference: Optional[float] = None
    waist_circumference: Optional[float] = None
    hip_circumference: Optional[float] = None
    # avatar_path은 서버에서 처리하므로 포함하지 않음

class CreateFittingRequest(BaseModel):
    avatar_idx: int
    clo_idx: int
=======
    img_rname: str
    img_size: int
    img_ext: str

class CreateFittingRequest(BaseModel):
    avatar_idx: int
    clo_idx: int
>>>>>>> develop
