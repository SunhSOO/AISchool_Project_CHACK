# tests/test_fitting.py

import os
from fastapi.testclient import TestClient

def test_create_fitting(client: TestClient):
    response = client.post(
        "/fittings/",
        json={
            "avatar_idx": 1,  # 실제 존재하는 avatar_idx로 변경 필요
            "clo_idx": 1  # 실제 존재하는 clo_idx로 변경 필요
        }
    )
    assert response.status_code == 200
    print("Create Fitting Response:", response.json())
    return response.json()["fitting_idx"]  # 삭제 테스트를 위한 fitting_idx 반환

def test_get_fittings(client: TestClient):
    response = client.get("/fittings/", params={"avatar_idx": 1})  # 실제 존재하는 avatar_idx로 변경 필요
    assert response.status_code == 200
    print("Get Fittings Response:", response.json())

def test_delete_fitting(client: TestClient):
    # 먼저 피팅 생성
    response = client.post(
        "/fittings/",
        json={
            "avatar_idx": 1,  # 실제 존재하는 avatar_idx로 변경 필요
            "clo_idx": 1  # 실제 존재하는 clo_idx로 변경 필요
        }
    )
    assert response.status_code == 200
    fitting_id = response.json()["fitting_idx"]
    
    # 피팅 삭제
    delete_response = client.delete(f"/fittings/{fitting_id}")
    assert delete_response.status_code == 204
    print(f"Delete Fitting with ID {fitting_id} Response: No Content")
    
    # 삭제된 피팅이 실제로 삭제되었는지 확인
    get_response = client.get("/fittings/", params={"avatar_idx": 1})  # 실제 존재하는 avatar_idx로 변경 필요
    assert get_response.status_code == 200
    fittings = get_response.json()
    assert all(fitting["fitting_idx"] != fitting_id for fitting in fittings)
    print(f"Verified Fitting with ID {fitting_id} has been deleted.")
