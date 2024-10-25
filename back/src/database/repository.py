# database/repository.py

<<<<<<< HEAD
from typing import List, Optional
=======
from typing import List
>>>>>>> develop
from sqlalchemy import select, delete
from sqlalchemy.orm import Session
from fastapi import Depends
from database.connection import get_db
from database.orm import Clothes, User, Avatar, Fitting
<<<<<<< HEAD
import logging

logger = logging.getLogger(__name__)

class ClothesRepository:
=======

# 의류 데이터를 다루는 ClothesRepository 클래스
class ClothesRepository:
    # 의존성 주입을 통해 세션(Session) 객체를 자동으로 주입
>>>>>>> develop
    def __init__(self, session: Session = Depends(get_db)):
        self.session = session
        self.model = Clothes

<<<<<<< HEAD
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
=======
    # 모든 의류 데이터를 가져오는 함수
    def get_clothes(self) -> List[Clothes]:
        # SQLAlchemy의 select를 사용해 Clothes 테이블의 모든 데이터를 가져옴
        return self.session.scalars(select(Clothes)).all()

    # 특정 의류의 ID로 해당 의류 데이터를 가져오는 함수
    def get_clothes_by_id(self, clo_idx: int) -> Clothes | None:
        # 의류의 고유 ID(clo_idx)를 조건으로 데이터베이스에서 검색
        return self.session.scalar(select(Clothes).where(Clothes.clo_idx == clo_idx))

    # 새로운 의류 데이터를 생성하는 함수
    def create_clothes(self, request) -> Clothes:
        # request 데이터를 바탕으로 Clothes 객체 생성
        clothes = Clothes.create(request)
        # 생성된 객체를 데이터베이스에 추가하고 커밋
        self.session.add(clothes)
        self.session.commit()
        # 세션을 새로고침하여 데이터 업데이트
        self.session.refresh(clothes)
        return clothes

    # 의류 데이터를 업데이트하는 함수
    def update_clothes(self, clothes: Clothes, request) -> Clothes:
        # request에서 받은 데이터를 이용해 기존 의류 정보 업데이트
        clothes.clo_name = request.clo_name
        clothes.clo_desc = request.clo_desc
        clothes.clo_price = request.clo_price
        clothes.clo_3d = request.clo_3d
        # 업데이트된 정보를 데이터베이스에 저장
>>>>>>> develop
        self.session.add(clothes)
        self.session.commit()
        self.session.refresh(clothes)
        return clothes

<<<<<<< HEAD
    def delete_clothes(self, clo_idx: int) -> None:
        self.session.execute(delete(Clothes).where(Clothes.clo_idx == clo_idx))
        self.session.commit()

=======
    # 특정 의류 데이터를 삭제하는 함수
    def delete_clothes(self, clo_idx: int) -> None:
        # 해당 ID(clo_idx)를 가진 의류 데이터를 삭제
        self.session.execute(delete(Clothes).where(Clothes.clo_idx == clo_idx))
        self.session.commit()

# 사용자 데이터를 다루는 UserRepository 클래스
>>>>>>> develop
class UserRepository:
    def __init__(self, session: Session = Depends(get_db)):
        self.session = session
        self.model = User

<<<<<<< HEAD
    def get_user_by_user_id(self, user_id: str) -> User | None:
        return self.session.scalar(select(User).where(User.user_id == user_id))

    def get_user_by_user_email(self, user_email: str) -> User | None:
        return self.session.scalar(select(User).where(User.user_email == user_email))

=======
    # 사용자 ID(user_id)로 특정 사용자 데이터를 가져오는 함수
    def get_user_by_user_id(self, user_id: str) -> User | None:
        return self.session.scalar(
            select(User).where(User.user_id == user_id)
        )

    # 이메일로 특정 사용자 데이터를 가져오는 함수
    def get_user_by_user_email(self, user_email: str) -> User | None:
        return self.session.scalar(
            select(User).where(User.user_email == user_email)
        )

    # 사용자 데이터를 저장하는 함수
>>>>>>> develop
    def save_user(self, user: User) -> User:
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        return user

<<<<<<< HEAD
=======
# 아바타 데이터를 다루는 AvatarRepository 클래스
>>>>>>> develop
class AvatarRepository:
    def __init__(self, session: Session = Depends(get_db)):
        self.session = session
        self.model = Avatar

<<<<<<< HEAD
    def get_avatars_by_user_id(self, user_id: str) -> List[Avatar]:
        return self.session.scalars(select(Avatar).where(Avatar.user_id == user_id)).all()

    def get_avatar_by_id(self, avatar_idx: int) -> Avatar | None:  # **새로운 메서드 추가**
        return self.session.scalar(select(Avatar).where(Avatar.avatar_idx == avatar_idx))

=======
    # 사용자 ID(user_id)로 해당 사용자의 모든 아바타 데이터를 가져오는 함수
    def get_avatars_by_user_id(self, user_id: str) -> List[Avatar]:
        return self.session.scalars(select(Avatar).where(Avatar.user_id == user_id)).all()

    # 새로운 아바타 데이터를 생성하는 함수
>>>>>>> develop
    def create_avatar(self, avatar: Avatar) -> Avatar:
        self.session.add(avatar)
        self.session.commit()
        self.session.refresh(avatar)
        return avatar
<<<<<<< HEAD
    
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

=======

# 피팅 데이터를 다루는 FittingRepository 클래스
>>>>>>> develop
class FittingRepository:
    def __init__(self, session: Session = Depends(get_db)):
        self.session = session
        self.model = Fitting

<<<<<<< HEAD
    def get_fittings_by_avatar_idx(self, avatar_idx: int) -> List[Fitting]:
        return self.session.scalars(select(Fitting).where(Fitting.avatar_idx == avatar_idx)).all()
    
    def get_fitting_by_id(self, fitting_idx: int) -> Fitting | None:  # 추가: get_fitting_by_id 메서드
        return self.session.scalar(select(Fitting).where(Fitting.fitting_idx == fitting_idx))
    
=======
    # 아바타 ID(avatar_idx)로 해당 아바타의 모든 피팅 데이터를 가져오는 함수
    def get_fittings_by_avatar_idx(self, avatar_idx: int) -> List[Fitting]:
        return self.session.scalars(select(Fitting).where(Fitting.avatar_idx == avatar_idx)).all()

    # 새로운 피팅 데이터를 생성하는 함수
>>>>>>> develop
    def create_fitting(self, fitting: Fitting) -> Fitting:
        self.session.add(fitting)
        self.session.commit()
        self.session.refresh(fitting)
<<<<<<< HEAD
        return fitting
    
    def delete_fitting(self, fitting_idx: int) -> None:
        fitting = self.get_fitting_by_id(fitting_idx)
        if not fitting:
            logger.warning(f"Fitting with id {fitting_idx} not found for deletion.")
            return
        self.session.delete(fitting)
        self.session.commit()
        logger.info(f"Fitting with id {fitting_idx} has been deleted.")
=======
        return fitting
>>>>>>> develop
