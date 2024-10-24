# tests/test_fitting.py

def test_create_fitting(client):
    response = client.post(
        "/fittings/",
        json={
            "avatar_idx": 1,
            "clo_idx": 1
        }
    )
    assert response.status_code == 200
    print("Create Fitting Response:", response.json())

def test_get_fittings(client):
    response = client.get("/fittings/", params={"avatar_idx": 1})
    assert response.status_code == 200
    print("Get Fittings Response:", response.json())
