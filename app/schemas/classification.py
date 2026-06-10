from pydantic import BaseModel, ConfigDict
from datetime import datetime


class ClassificationResponse(BaseModel):
    id: int
    report_id: int
    label: str
    confidence: float
    model_name: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)