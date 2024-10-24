# tests/test_avatar.py

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
