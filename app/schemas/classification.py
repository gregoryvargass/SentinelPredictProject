from pydantic import BaseModel, ConfigDict
from datetime import datetime


class ClassificationResponse(BaseModel):
    id: int
    report_id: int
    label: str
    raw_label: str | None = None
    confidence: float
    requires_review: bool
    model_name: str | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)