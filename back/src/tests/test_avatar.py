# tests/test_avatar.py

import os
from fastapi.testclient import TestClient

def test_create_avatar(client: TestClient):
    # 테스트용 이미지 파일 생성
    test_image_path = "tests/test_image.jpg"
    with open(test_image_path, "wb") as f:
        f.write(os.urandom(1024))  # 1KB의 임의 데이터로 이미지 파일 생성

    with open(test_image_path, "rb") as image_file:
        response = client.post(
            "/avatars/",
            data={
                "user_id": "user123",
                "height": 170,
                "weight": 65,
                "chest_circumference": 90.5,
                "waist_circumference": 70.0,
                "hip_circumference": 95.0
            },
            files={
                "img_file": ("test_image.jpg", image_file, "image/jpeg")
            }
        )
    os.remove(test_image_path)  # 테스트용 파일 삭제

    assert response.status_code == 200
    print("Create Avatar Response:", response.json())
    avatar_idx = response.json()["avatar_idx"]
    assert response.json()["img_rname"] == "test_image.jpg"
    assert response.json()["avatar_path"] is None  # **avatar_path는 아직 None이어야 함**
    return avatar_idx  # 삭제 테스트를 위한 avatar_idx 반환
