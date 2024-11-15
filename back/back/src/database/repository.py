# database/repository.py

from typing import List, Optional
from sqlalchemy import select, delete
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException
from database.connection import get_db
from database.orm import Clothes, User, Avatar, Fitting
import logging
from utils.file_utils import delete_file


logger = logging.getLogger(__name__)


class UserRepository:
    def __init__(self, session: Session = Depends(get_db)):
        self.session = session
        self.model = User

    def get_user_by_user_id(self, user_id: str) -> Optional[User]:
        return self.session.scalar(select(User).where(User.user_id == user_id))

    def get_user_by_user_email(self, user_email: str) -> Optional[User]:
        return self.session.scalar(select(User).where(User.user_email == user_email))

    def save_user(self, user: User) -> User:
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        logger.info(f"사용자 저장 성공: {user.user_id}")
        return user

class ClothesRepository:
    def __init__(self, session: Session = Depends(get_db)):
        self.session = session
        self.model = Clothes

    def get_clothes(self) -> List[Clothes]:
        return self.session.scalars(select(Clothes)).all()

    def get_clothes_by_id(self, clo_idx: int) -> Optional[Clothes]:
        return self.session.scalar(select(Clothes).where(Clothes.clo_idx == clo_idx))

    def create_clothes(self, clothes_data: dict) -> Clothes:
        clothes = Clothes(**clothes_data)
        self.session.add(clothes)
        self.session.commit()
        self.session.refresh(clothes)
        logger.info(f"옷 생성 성공: clo_idx={clothes.clo_idx}")
        return clothes

    def update_clothes(self, clothes: Clothes) -> Clothes:
        self.session.add(clothes)
        self.session.commit()
        self.session.refresh(clothes)
        logger.info(f"옷 업데이트 성공: clo_idx={clothes.clo_idx}")
        return clothes

    def delete_clothes(self, clo_idx: int) -> None:
        clothes = self.get_clothes_by_id(clo_idx)
        if not clothes:
            logger.warning(f"Clothes with id {clo_idx} not found for deletion.")
            raise HTTPException(status_code=404, detail="옷을 찾을 수 없습니다.")

        try:
            delete_file(clothes.clo_img1)
            logger.info(f"이미지 파일 삭제 성공: {clothes.clo_img1}")
            # clo_3d 파일 삭제
            if clothes.clo_3d:
                delete_file(clothes.clo_3d)
                logger.info(f"3D 파일 삭제 성공: {clothes.clo_3d}")
                
        except HTTPException as e:
            logger.error(f"이미지 파일 삭제 실패: {e.detail}")
            raise HTTPException(status_code=500, detail="이미지 파일 삭제에 실패했습니다.")

        self.session.execute(delete(Clothes).where(Clothes.clo_idx == clo_idx))
        self.session.commit()
        logger.info(f"옷 삭제 성공: clo_idx={clo_idx}")

class AvatarRepository:
    def __init__(self, session: Session = Depends(get_db)):
        self.session = session
        self.model = Avatar

    def get_avatars_by_user_id(self, user_id: str) -> List[Avatar]:
        return self.session.scalars(select(Avatar).where(Avatar.user_id == user_id)).all()

    def get_avatar_by_id(self, avatar_idx: int) -> Optional[Avatar]:
        return self.session.scalar(select(Avatar).where(Avatar.avatar_idx == avatar_idx))

    def create_avatar(self, avatar: Avatar) -> Avatar:
        self.session.add(avatar)
        self.session.commit()
        self.session.refresh(avatar)
        logger.info(f"아바타 생성 성공: avatar_idx={avatar.avatar_idx}")
        return avatar

    def update_avatar(self, avatar: Avatar) -> Avatar:
        self.session.add(avatar)
        self.session.commit()
        self.session.refresh(avatar)
        logger.info(f"아바타 업데이트 성공: avatar_idx={avatar.avatar_idx}")
        return avatar

    def delete_avatar(self, avatar_idx: int) -> None:
        avatar = self.get_avatar_by_id(avatar_idx)
        if not avatar:
            logger.warning(f"Avatar with id {avatar_idx} not found for deletion.")
            raise HTTPException(status_code=404, detail="아바타를 찾을 수 없습니다.")

        try:
            delete_file(avatar.img_path)
            logger.info(f"이미지 파일 삭제 성공: {avatar.img_path}")
            delete_file(avatar.avatar_path)
            logger.info(f"3D 아바타 파일 삭제 성공: {avatar.avatar_path}")
        except HTTPException as e:
            logger.error(f"파일 삭제 실패: {e.detail}")
            raise HTTPException(status_code=500, detail="파일 삭제에 실패했습니다.")

        self.session.delete(avatar)
        self.session.commit()
        logger.info(f"Avatar with id {avatar_idx} has been deleted.")

class FittingRepository:
    def __init__(self, session: Session = Depends(get_db)):
        self.session = session
        self.model = Fitting

    def get_fittings_by_avatar_idx(self, avatar_idx: int) -> List[Fitting]:
        return self.session.scalars(select(Fitting).where(Fitting.avatar_idx == avatar_idx)).all()
    
    def get_fitting_by_id(self, fitting_idx: int) -> Optional[Fitting]:
        return self.session.scalar(select(Fitting).where(Fitting.fitting_idx == fitting_idx))
    
    def create_fitting(self, fitting: Fitting) -> Fitting:
        self.session.add(fitting)
        self.session.commit()
        self.session.refresh(fitting)
        logger.info(f"피팅 생성 성공: fitting_idx={fitting.fitting_idx}")
        return fitting
    
    def delete_fitting(self, fitting_idx: int) -> None:
        fitting = self.get_fitting_by_id(fitting_idx)
        if not fitting:
            logger.warning(f"피팅 id {fitting_idx} not found for deletion.")
            raise HTTPException(status_code=404, detail="피팅을 찾을 수 없습니다.")
        self.session.delete(fitting)
        self.session.commit()
        logger.info(f"피팅 id {fitting_idx} 삭제성공.")
