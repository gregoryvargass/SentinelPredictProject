from pydantic import BaseModel
from app.schemas.classification import ClassificationResponse
from app.schemas.entity import EntityResponse
from app.schemas.summary import SummaryResponse


class ProcessingResultResponse(BaseModel):
    classification: ClassificationResponse | None
    entities: list[EntityResponse]
    summary: SummaryResponse | None

    model_config = {
        "json_schema_extra": {
            "example": {
                "classification": {
                    "id": 1,
                    "report_id": 1,
                    "label": "Riesgo de caída",
                    "confidence": 0.93,
                    "model_name": "mock-classifier-v1",
                    "created_at": "2026-04-06T12:00:00"
                },
                "entities": [
                    {
                        "id": 1,
                        "report_id": 1,
                        "text": "operario",
                        "label": "PERSONA",
                        "start_char": 3,
                        "end_char": 11,
                        "confidence": 0.95,
                        "created_at": "2026-04-06T12:00:00"
                    }
                ],
                "summary": {
                    "id": 1,
                    "report_id": 1,
                    "content": "El reporte describe un incidente relacionado con riesgo de caída.",
                    "model_name": "mock-summarizer-v1",
                    "created_at": "2026-04-06T12:00:00"
                }
            }
        }
    }