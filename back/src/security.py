# from fastapi import HTTPException, Depends
# from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

# # 인증 토큰을 추출하는 함수
# def get_access_token(
#     # HTTPBearer를 사용하여 Authorization 헤더에서 인증 정보를 추출
#     auth_header: HTTPAuthorizationCredentials | None = Depends(
#         HTTPBearer(auto_error=False)
#     )
# ) -> str:
#     # 인증 정보가 없을 경우 401 Unauthorized 에러 발생
#     if auth_header is None:
#         raise HTTPException(
#             status_code=401,
#             detail="Not Authorized",
#         )
#     # 인증 정보가 있을 경우 토큰(access_token)을 반환
#     return auth_header.credentials  # access_token

