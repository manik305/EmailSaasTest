import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the SaaS Email Campaign API"}

def test_auth_endpoints_exist():
    # Check if auth routes are registered
    routes = [route.path for route in app.routes]
    assert "/api/v1/auth/login" in [r for r in routes if "/api/v1/auth" in r] or any("/api/v1/auth" in r for r in routes)

def test_campaign_endpoints_exist():
    routes = [route.path for route in app.routes]
    assert any("/api/v1/campaigns" in r for r in routes)

def test_data_endpoints_exist():
    routes = [route.path for route in app.routes]
    assert any("/api/v1/data" in r for r in routes)

def test_config_endpoints_exist():
    routes = [route.path for route in app.routes]
    assert any("/api/v1/config" in r for r in routes)

def test_chat_endpoints_exist():
    routes = [route.path for route in app.routes]
    assert any("/api/v1/chat" in r for r in routes)

def test_meetings_endpoints_exist():
    routes = [route.path for route in app.routes]
    assert any("/api/v1/meetings" in r for r in routes)
