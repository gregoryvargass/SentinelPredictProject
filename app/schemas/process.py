from pydantic import BaseModel


class ProcessReportResponse(BaseModel):
    message: str
    report_id: int
    status: str

    model_config = {
        "json_schema_extra": {
            "example": {
                "message": "Reporte 1 procesado correctamente",
                "report_id": 1,
                "status": "processed"
            }
        }
    }