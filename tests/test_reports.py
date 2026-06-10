from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_create_report():
    payload = {
        "title": "Resbalón en área de carga",
        "description": "Un operario resbaló por presencia de líquido en el suelo durante la jornada.",
        "source": "manual",
        "area": "Logística",
        "incident_date": "2026-04-06T09:00:00"
    }

    response = client.post("/reports/", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert data["title"] == payload["title"]
    assert data["status"] == "pending"


def test_get_reports():
    response = client.get("/reports/")

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_get_report_by_id():
    response = client.get("/reports/1")

    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 1


def test_process_report():
    response = client.post("/reports/1/process")

    assert response.status_code == 200
    data = response.json()
    assert data["report_id"] == 1
    assert data["status"] in ["processed", "failed", "pending"]


def test_get_processing_results():
    response = client.get("/reports/1/results")

    assert response.status_code == 200
    data = response.json()
    assert "classification" in data
    assert "entities" in data
    assert "summary" in data