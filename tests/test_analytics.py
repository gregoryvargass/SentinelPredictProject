from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_get_analytics_summary():
    response = client.get("/analytics/summary")

    assert response.status_code == 200
    data = response.json()

    assert "total_reports" in data
    assert "processed_reports" in data
    assert "pending_reports" in data
    assert "failed_reports" in data
    assert "most_common_incident" in data
    assert "most_affected_area" in data


def test_get_incidents_by_type():
    response = client.get("/analytics/incidents-by-type")

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

    if len(data) > 0:
        assert "label" in data[0]
        assert "count" in data[0]


def test_get_incidents_by_area():
    response = client.get("/analytics/incidents-by-area")

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

    if len(data) > 0:
        assert "area" in data[0]
        assert "count" in data[0]


def test_get_top_entities():
    response = client.get("/analytics/top-entities")

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

    if len(data) > 0:
        assert "text" in data[0]
        assert "label" in data[0]
        assert "count" in data[0]


def test_get_recommendations():
    response = client.get("/analytics/recommendations")

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

    if len(data) > 0:
        assert "title" in data[0]
        assert "reason" in data[0]
        assert "priority" in data[0]


def test_get_trends():
    response = client.get("/analytics/trends")

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

    if len(data) > 0:
        assert "date" in data[0]
        assert "count" in data[0]


def test_get_dashboard_data():
    response = client.get("/analytics/dashboard")

    assert response.status_code == 200
    data = response.json()

    assert "summary" in data
    assert "incidents_by_type" in data
    assert "incidents_by_area" in data
    assert "top_entities" in data
    assert "recommendations" in data
    assert "trends" in data