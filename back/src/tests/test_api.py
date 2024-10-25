# tests/test_api.py

import pytest

def test_signup(client):
    response = client.post(
        "/users/sign-up",
        json={
            "user_id": "user123",
            "user_name": "testuser",
            "password": "testpass",
            "user_email": "testuser@example.com"
        }
    )
    assert response.status_code == 200
    print("Signup Response:", response.json())

def test_login(client):
    response = client.post(
        "/users/log-in",
        json={
            "user_id": "user123",
            "password": "testpass"
        }
    )
    assert response.status_code == 200
    print("Login Response:", response.json())
    user_data = response.json()
    assert user_data["user_id"] == "user123"

def test_create_clothes(client):
    response = client.post(
        "/clothes/",
        json={
            "clo_name": "티셔츠",
            "clo_desc": "멋진 티셔츠입니다.",
            "clo_price": 50000,
            "clo_3d": "3d_image_path"
        }
    )
    assert response.status_code == 200
    print("Create Clothes Response:", response.json())

def test_get_clothes(client):
    response = client.get("/clothes/")
    assert response.status_code == 200
    print("Get Clothes Response:", response.json())

