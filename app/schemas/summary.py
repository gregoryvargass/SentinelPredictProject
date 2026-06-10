from pydantic import BaseModel, ConfigDict
from datetime import datetime


class SummaryResponse(BaseModel):
    id: int
    report_id: int
    content: str
    model_name: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)