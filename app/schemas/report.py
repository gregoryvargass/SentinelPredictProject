from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional
from app.schemas.classification import ClassificationResponse
from app.schemas.entity import EntityResponse
from app.schemas.summary import SummaryResponse


class ReportCreate(BaseModel):
    title: str = Field(
        ...,
        min_length=3,
        max_length=200,
        description="Título descriptivo del reporte"
    )
    description: str = Field(
        ...,
        min_length=10,
        description="Descripción narrativa del incidente industrial"
    )
    source: Optional[str] = Field(
        default="manual",
        max_length=100,
        description="Origen del reporte"
    )
    area: Optional[str] = Field(
        default=None,
        max_length=100,
        description="Área operativa donde ocurrió el incidente"
    )
    incident_date: Optional[datetime] = Field(
        default=None,
        description="Fecha y hora del incidente"
    )

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "title": "Resbalón en zona de carga",
                "description": "Un operario resbaló por presencia de líquido en el suelo mientras movía materiales.",
                "source": "manual",
                "area": "Logística",
                "incident_date": "2026-04-06T11:00:00"
            }
        }
    )


class ReportUpdate(BaseModel):
    title: str = Field(
        ...,
        min_length=3,
        max_length=200,
        description="Título descriptivo del reporte"
    )
    description: str = Field(
        ...,
        min_length=10,
        description="Descripción narrativa del incidente industrial"
    )
    source: Optional[str] = Field(
        default="manual",
        max_length=100,
        description="Origen del reporte"
    )
    area: Optional[str] = Field(
        default=None,
        max_length=100,
        description="Área operativa donde ocurrió el incidente"
    )
    incident_date: Optional[datetime] = Field(
        default=None,
        description="Fecha y hora del incidente"
    )


class ReportResponse(BaseModel):
    id: int
    title: str
    description: str
    source: Optional[str]
    area: Optional[str]
    incident_date: Optional[datetime]
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ReportFullResponse(BaseModel):
    id: int
    title: str
    description: str
    source: Optional[str]
    area: Optional[str]
    incident_date: Optional[datetime]
    status: str
    created_at: datetime
    classification: ClassificationResponse | None
    entities: list[EntityResponse]
    summary: SummaryResponse | None

    model_config = ConfigDict(from_attributes=True)