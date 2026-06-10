from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.services.analytics_service import AnalyticsService
from app.schemas.analytics import (
    AnalyticsSummaryResponse,
    IncidentTypeCountResponse,
    AreaCountResponse,
    TopEntityResponse,
    RecommendationResponse,
    TrendPointResponse,
    DashboardResponse,
)

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get(
    "/summary",
    response_model=AnalyticsSummaryResponse,
    summary="Resumen general del sistema",
    description="Devuelve métricas globales del sistema como total de reportes, estados, incidente más común y área más afectada."
)
def get_summary(db: Session = Depends(get_db)):
    service = AnalyticsService(db)
    return service.get_summary()


@router.get(
    "/incidents-by-type",
    response_model=list[IncidentTypeCountResponse],
    summary="Incidentes por tipo",
    description="Devuelve la distribución de reportes procesados por categoría de incidente."
)
def get_incidents_by_type(db: Session = Depends(get_db)):
    service = AnalyticsService(db)
    return service.get_incidents_by_type()


@router.get(
    "/incidents-by-area",
    response_model=list[AreaCountResponse],
    summary="Incidentes por área",
    description="Devuelve la distribución de incidentes según el área operativa."
)
def get_incidents_by_area(db: Session = Depends(get_db)):
    service = AnalyticsService(db)
    return service.get_incidents_by_area()


@router.get(
    "/top-entities",
    response_model=list[TopEntityResponse],
    summary="Entidades más frecuentes",
    description="Devuelve las entidades detectadas con mayor frecuencia en los reportes procesados."
)
def get_top_entities(db: Session = Depends(get_db)):
    service = AnalyticsService(db)
    return service.get_top_entities()


@router.get(
    "/recommendations",
    response_model=list[RecommendationResponse],
    summary="Recomendaciones automáticas",
    description="Devuelve recomendaciones preventivas generadas a partir de patrones observados en los reportes."
)
def get_recommendations(db: Session = Depends(get_db)):
    service = AnalyticsService(db)
    return service.get_recommendations()


@router.get(
    "/trends",
    response_model=list[TrendPointResponse],
    summary="Tendencias de incidentes",
    description="Devuelve la frecuencia de incidentes agrupada por fecha."
)
def get_trends(db: Session = Depends(get_db)):
    service = AnalyticsService(db)
    return service.get_trends()

@router.get(
    "/dashboard",
    response_model=DashboardResponse,
    summary="Dashboard consolidado",
    description="Devuelve toda la información necesaria para cargar el dashboard principal del sistema en una sola respuesta."
)
def get_dashboard_data(
    start_date: str | None = None,
    end_date: str | None = None,
    db: Session = Depends(get_db)
):
    service = AnalyticsService(db)
    return service.get_dashboard_data(start_date, end_date)