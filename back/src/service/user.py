import bcrypt

# 사용자 관련 기능을 제공하는 서비스 클래스
class UserService:
    # 인코딩 방식 (기본값: UTF-8)
    encoding: str = "UTF-8"

    # 비밀번호를 해시화하는 메서드
    def hash_password(self, plain_password: str) -> str:
        # 입력받은 평문 비밀번호를 UTF-8로 인코딩한 후 해시화
        hashed_password: bytes = bcrypt.hashpw(
            plain_password.encode(self.encoding),  # 비밀번호를 바이트로 변환
            salt=bcrypt.gensalt()  # 랜덤한 솔트 값 생성 후 사용
        )
        # 해시화된 비밀번호를 다시 UTF-8로 디코딩하여 문자열로 반환
        return hashed_password.decode(self.encoding)

    # 비밀번호를 검증하는 메서드
    def verify_password(
            self, plain_password: str, hashed_password: str
    ) -> bool:
        # 입력받은 평문 비밀번호와 해시화된 비밀번호를 비교하여 일치 여부를 반환
        return bcrypt.checkpw(
            plain_password.encode(self.encoding),  # 평문 비밀번호를 바이트로 변환
            hashed_password.encode(self.encoding)  # 해시화된 비밀번호를 바이트로 변환
        )

