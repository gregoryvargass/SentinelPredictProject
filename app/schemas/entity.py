from pydantic import BaseModel, ConfigDict
from datetime import datetime


class EntityResponse(BaseModel):
    id: int
    report_id: int
    text: str
    label: str
    start_char: int | None
    end_char: int | None
    confidence: float
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)