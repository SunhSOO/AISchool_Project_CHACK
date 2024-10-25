# tests/conftest.py

import pytest
from fastapi.testclient import TestClient
from main import app

@pytest.fixture()
def client():
<<<<<<< HEAD
    return TestClient(app=app)
=======
    return TestClient(app=app)
>>>>>>> develop
