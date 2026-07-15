from pydantic import BaseModel, ConfigDict
from app.schemas.classification import ClassificationResponse
from app.schemas.entity import EntityResponse
from app.schemas.summary import SummaryResponse


class ProcessingResultResponse(BaseModel):
    classification: ClassificationResponse | None
    entities: list[EntityResponse]
    summary: SummaryResponse | None

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "classification": {
                    "id": 1,
                    "report_id": 1,
                    "label": "Riesgo eléctrico",
                    "raw_label": "riesgo_electrico",
                    "confidence": 0.8295,
                    "requires_review": False,
                    "model_name": "distilbert-multilingual-incident-classifier-v1",
                    "created_at": "2026-04-06T12:00:00"
                },
                "entities": [
                    {
                        "id": 1,
                        "report_id": 1,
                        "text": "cable expuesto",
                        "label": "CONDICION",
                        "start_char": 18,
                        "end_char": 32,
                        "confidence": 0.90,
                        "created_at": "2026-04-06T12:00:00"
                    }
                ],
                "summary": {
                    "id": 1,
                    "report_id": 1,
                    "content": "El reporte describe un incidente asociado a riesgo eléctrico, relacionado con cableado, corriente o equipos energizados.",
                    "model_name": "mvp-rule-summarizer-v2",
                    "created_at": "2026-04-06T12:00:00"
                }
            }
        }
    )