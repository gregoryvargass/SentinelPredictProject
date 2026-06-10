from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.schemas.report import ReportCreate, ReportResponse, ReportFullResponse, ReportUpdate
from app.schemas.processing import ProcessingResultResponse
from app.schemas.process import ProcessReportResponse
from app.services.report_service import ReportService

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


@router.get(
    "/",
    response_model=list[ReportResponse],
    summary="Listar todos los reportes",
    description="Obtiene la lista de reportes registrados en la base de datos."
)
def get_reports(db: Session = Depends(get_db)):
    service = ReportService(db)
    return service.get_all_reports()


@router.get(
    "/{report_id}",
    response_model=ReportResponse,
    summary="Obtener un reporte por ID",
    description="Devuelve la información básica de un reporte específico."
)
def get_report_by_id(report_id: int, db: Session = Depends(get_db)):
    service = ReportService(db)
    return service.get_report_by_id(report_id)


@router.get(
    "/{report_id}/full",
    response_model=ReportFullResponse,
    summary="Obtener un reporte con resultados completos",
    description="Devuelve un reporte junto con su clasificación, entidades detectadas y resumen generado."
)
def get_full_report_by_id(report_id: int, db: Session = Depends(get_db)):
    service = ReportService(db)
    return service.get_full_report_by_id(report_id)


@router.post(
    "/",
    response_model=ReportResponse,
    summary="Crear un nuevo reporte",
    description="Registra un nuevo reporte narrativo de incidente industrial."
)
def create_report(report: ReportCreate, db: Session = Depends(get_db)):
    service = ReportService(db)
    return service.create_report(report)

@router.put(
    "/{report_id}",
    response_model=ReportResponse,
    summary="Actualizar un reporte",
    description="Actualiza la información básica de un reporte existente."
)
def update_report(report_id: int, report: ReportUpdate, db: Session = Depends(get_db)):
    service = ReportService(db)
    return service.update_report(report_id, report)

@router.post(
    "/{report_id}/process",
    response_model=ProcessReportResponse,
    summary="Procesar un reporte",
    description="Ejecuta el pipeline de procesamiento NLP sobre un reporte y almacena clasificación, entidades y resumen."
)
def process_report(report_id: int, db: Session = Depends(get_db)):
    service = ReportService(db)
    return service.process_report(report_id)


@router.get(
    "/{report_id}/results",
    response_model=ProcessingResultResponse,
    summary="Consultar resultados del procesamiento",
    description="Obtiene únicamente los resultados generados por el pipeline NLP para un reporte específico."
)
def get_processing_results(report_id: int, db: Session = Depends(get_db)):
    service = ReportService(db)
    return service.get_processing_results(report_id)

@router.delete(
    "/{report_id}",
    summary="Eliminar un reporte",
    description="Elimina un reporte existente y sus datos asociados."
)
def delete_report(report_id: int, db: Session = Depends(get_db)):
    service = ReportService(db)
    return service.delete_report(report_id)