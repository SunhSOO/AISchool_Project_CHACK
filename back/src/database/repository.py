# database/repository.py

from typing import List, Optional
from sqlalchemy import select, delete
from sqlalchemy.orm import Session
from fastapi import Depends
from database.connection import get_db
from database.orm import Clothes, User, Avatar, Fitting
import logging

logger = logging.getLogger(__name__)

class ClothesRepository:
    def __init__(self, session: Session = Depends(get_db)):
        self.session = session
        self.model = Clothes

    def get_clothes(self) -> List[Clothes]:
        return self.session.scalars(select(Clothes)).all()

    def get_clothes_by_id(self, clo_idx: int) -> Clothes | None:
        return self.session.scalar(select(Clothes).where(Clothes.clo_idx == clo_idx))

    def create_clothes(self, clothes_data: dict) -> Clothes:
        clothes = Clothes(**clothes_data)
        self.session.add(clothes)
        self.session.commit()
        self.session.refresh(clothes)
        return clothes

    def update_clothes(self, clothes: Clothes) -> Clothes:
        self.session.add(clothes)
        self.session.commit()
        self.session.refresh(clothes)
        return clothes

    def delete_clothes(self, clo_idx: int) -> None:
        self.session.execute(delete(Clothes).where(Clothes.clo_idx == clo_idx))
        self.session.commit()

class UserRepository:
    def __init__(self, session: Session = Depends(get_db)):
        self.session = session
        self.model = User

    def get_user_by_user_id(self, user_id: str) -> User | None:
        return self.session.scalar(select(User).where(User.user_id == user_id))

    def get_user_by_user_email(self, user_email: str) -> User | None:
        return self.session.scalar(select(User).where(User.user_email == user_email))

    def save_user(self, user: User) -> User:
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        return user

class AvatarRepository:
    def __init__(self, session: Session = Depends(get_db)):
        self.session = session
        self.model = Avatar

    def get_avatars_by_user_id(self, user_id: str) -> List[Avatar]:
        return self.session.scalars(select(Avatar).where(Avatar.user_id == user_id)).all()

    def get_avatar_by_id(self, avatar_idx: int) -> Avatar | None:  # **새로운 메서드 추가**
        return self.session.scalar(select(Avatar).where(Avatar.avatar_idx == avatar_idx))

    def create_avatar(self, avatar: Avatar) -> Avatar:
        self.session.add(avatar)
        self.session.commit()
        self.session.refresh(avatar)
        return avatar
    
    def update_avatar(self, avatar: Avatar) -> Avatar:
        self.session.add(avatar)
        self.session.commit()
        self.session.refresh(avatar)
        return avatar
    
         # **새로운 메서드 추가: delete_avatar**
    def delete_avatar(self, avatar_idx: int) -> None:
        avatar = self.get_avatar_by_id(avatar_idx)
        if not avatar:
            logger.warning(f"Avatar with id {avatar_idx} not found for deletion.")
            return
        self.session.delete(avatar)
        self.session.commit()
        logger.info(f"Avatar with id {avatar_idx} has been deleted.")

class FittingRepository:
    def __init__(self, session: Session = Depends(get_db)):
        self.session = session
        self.model = Fitting

    def get_fittings_by_avatar_idx(self, avatar_idx: int) -> List[Fitting]:
        return self.session.scalars(select(Fitting).where(Fitting.avatar_idx == avatar_idx)).all()
    
    def get_fitting_by_id(self, fitting_idx: int) -> Fitting | None:  # 추가: get_fitting_by_id 메서드
        return self.session.scalar(select(Fitting).where(Fitting.fitting_idx == fitting_idx))
    
    def create_fitting(self, fitting: Fitting) -> Fitting:
        self.session.add(fitting)
        self.session.commit()
        self.session.refresh(fitting)
        return fitting
    
    def delete_fitting(self, fitting_idx: int) -> None:
        fitting = self.get_fitting_by_id(fitting_idx)
        if not fitting:
            logger.warning(f"Fitting with id {fitting_idx} not found for deletion.")
            return
        self.session.delete(fitting)
        self.session.commit()
        logger.info(f"Fitting with id {fitting_idx} has been deleted.")