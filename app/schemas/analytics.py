from pydantic import BaseModel


class AnalyticsSummaryResponse(BaseModel):
    total_reports: int
    processed_reports: int
    pending_reports: int
    failed_reports: int
    most_common_incident: str | None
    most_affected_area: str | None


class IncidentTypeCountResponse(BaseModel):
    label: str
    count: int


class AreaCountResponse(BaseModel):
    area: str
    count: int


class TopEntityResponse(BaseModel):
    text: str
    label: str
    count: int


class RecommendationResponse(BaseModel):
    title: str
    reason: str
    priority: str


class TrendPointResponse(BaseModel):
    date: str
    count: int
    

class DashboardResponse(BaseModel):
    summary: AnalyticsSummaryResponse
    incidents_by_type: list[IncidentTypeCountResponse]
    incidents_by_area: list[AreaCountResponse]
    top_entities: list[TopEntityResponse]
    recommendations: list[RecommendationResponse]
    trends: list[TrendPointResponse]