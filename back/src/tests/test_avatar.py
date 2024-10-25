# tests/test_avatar.py

<<<<<<< HEAD
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
    return response.json()["avatar_idx"]  # 삭제 테스트를 위한 avatar_idx 반환

def test_get_avatars(client: TestClient):
    response = client.get("/avatars/", params={"user_id": "user123"})
    assert response.status_code == 200
    print("Get Avatars Response:", response.json())

def test_delete_avatar(client: TestClient):
    # 먼저 아바타 생성
    test_image_path = "tests/test_image_to_delete.jpg"
    with open(test_image_path, "wb") as f:
        f.write(os.urandom(1024))  # 1KB의 임의 데이터로 이미지 파일 생성
    
    with open(test_image_path, "rb") as image_file:
        create_response = client.post(
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
                "img_file": ("test_image_to_delete.jpg", image_file, "image/jpeg")
            }
        )
    os.remove(test_image_path)  # 테스트용 파일 삭제

    assert create_response.status_code == 200
    avatar_id = create_response.json()["avatar_idx"]
    
    # 아바타 삭제
    delete_response = client.delete(f"/avatars/{avatar_id}")
    assert delete_response.status_code == 204
    print(f"Delete Avatar with ID {avatar_id} Response: No Content")
    
    # 삭제된 아바타가 실제로 삭제되었는지 확인
    get_response = client.get("/avatars/", params={"user_id": "user123"})
    assert get_response.status_code == 200
    avatars = get_response.json()
    assert all(avatar["avatar_idx"] != avatar_id for avatar in avatars)
    print(f"Verified Avatar with ID {avatar_id} has been deleted.")
=======
def test_create_avatar(client):
    response = client.post(
        "/avatars/",
        json={
            "user_id": "user123",
            "avatar_path": "path/to/avatar",
            "img_rname": "avatar_image.jpg",
            "img_size": 1024,
            "img_ext": ".jpg"
        }
    )
    assert response.status_code == 200
    print("Create Avatar Response:", response.json())

def test_get_avatars(client):
    response = client.get("/avatars/", params={"user_id": "user123"})
    assert response.status_code == 200
    print("Get Avatars Response:", response.json())
>>>>>>> develop
