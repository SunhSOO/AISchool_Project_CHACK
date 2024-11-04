# service/user.py

import bcrypt

class UserService:
    encoding: str = "UTF-8"
    '''encoding 속성은 문자열을 바이트 형태로 인코딩하거나 바이트를 문자열로 디코딩할 때
      사용할 문자 인코딩 방식을 지정합니다. 여기서는 "UTF-8" 인코딩을 사용'''
    
    def hash_password(self, plain_password: str) -> str:
        '''비밀번호 해시하여 반환'''
        hashed_password: bytes = bcrypt.hashpw(
            plain_password.encode(self.encoding),
            salt=bcrypt.gensalt()
        )
        return hashed_password.decode(self.encoding)

    def verify_password(
            self, plain_password: str, hashed_password: str
    ) -> bool:
        '''비밀번호를 검증해 일치 여부 반환'''
        return bcrypt.checkpw(
            plain_password.encode(self.encoding),
            hashed_password.encode(self.encoding)
        )