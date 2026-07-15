from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.report import Report
from app.models.classification import Classification
from app.models.entity import Entity
from app.models.summary import Summary
from app.schemas.report import ReportCreate, ReportUpdate
from app.services.nlp_service import NLPService


class ReportService:
    def __init__(self, db: Session):
        self.db = db
        self.nlp_service = NLPService()

    def get_all_reports(self):
        return self.db.query(Report).all()

    def get_report_by_id(self, report_id: int):
        report = self.db.query(Report).filter(Report.id == report_id).first()

        if not report:
            raise HTTPException(status_code=404, detail="Reporte no encontrado")

        return report

    def create_report(self, report_data: ReportCreate):
        new_report = Report(
            title=report_data.title,
            description=report_data.description,
            source=report_data.source,
            area=report_data.area,
            incident_date=report_data.incident_date,
            status="pending"
        )

        self.db.add(new_report)
        self.db.commit()
        self.db.refresh(new_report)

        return new_report

    def update_report(self, report_id: int, report_data: ReportUpdate):
        report = self.db.query(Report).filter(Report.id == report_id).first()

        if not report:
            raise HTTPException(status_code=404, detail="Reporte no encontrado")

        report.title = report_data.title
        report.description = report_data.description
        report.source = report_data.source
        report.area = report_data.area
        report.incident_date = report_data.incident_date

        self.db.commit()
        self.db.refresh(report)

        return report

    def process_report(self, report_id: int):
        report = self.db.query(Report).filter(Report.id == report_id).first()

        if not report:
            raise HTTPException(status_code=404, detail="Reporte no encontrado")

        if report.status == "processed":
            return {
                "message": f"El reporte {report.id} ya fue procesado previamente",
                "report_id": report.id,
                "status": report.status
            }

        try:
            existing_classification = (
                self.db.query(Classification)
                .filter(Classification.report_id == report_id)
                .first()
            )
            existing_summary = (
                self.db.query(Summary)
                .filter(Summary.report_id == report_id)
                .first()
            )
            existing_entities = (
                self.db.query(Entity)
                .filter(Entity.report_id == report_id)
                .all()
            )

            if existing_classification or existing_summary or existing_entities:
                report.status = "processed"
                self.db.commit()
                self.db.refresh(report)

                return {
                    "message": f"El reporte {report.id} ya tenía resultados asociados",
                    "report_id": report.id,
                    "status": report.status
                }

            classification_result = self.nlp_service.classify_report(report.description)
            entities_result = self.nlp_service.extract_entities(report.description)
            summary_result = self.nlp_service.build_hybrid_summary(
                report.description,
                classification_result,
                entities_result
            )

            classification = Classification(
                report_id=report.id,
                label=classification_result["label"],
                raw_label=classification_result["raw_label"],
                confidence=classification_result["confidence"],
                requires_review=classification_result["requires_review"],
                model_name=classification_result["model_name"]
            )

            summary = Summary(
                report_id=report.id,
                content=summary_result["content"],
                model_name=summary_result["model_name"]
            )

            self.db.add(classification)
            self.db.add(summary)

            for entity_data in entities_result:
                entity = Entity(
                    report_id=report.id,
                    text=entity_data["text"],
                    label=entity_data["label"],
                    start_char=entity_data["start_char"],
                    end_char=entity_data["end_char"],
                    confidence=entity_data["confidence"]
                )
                self.db.add(entity)

            report.status = "processed"

            self.db.commit()
            self.db.refresh(report)

            return {
                "message": f"Reporte {report.id} procesado correctamente",
                "report_id": report.id,
                "status": report.status
            }

        except ValueError as e:
            report.status = "failed"
            self.db.commit()
            raise HTTPException(status_code=400, detail=str(e))

        except Exception as e:
            report.status = "failed"
            self.db.commit()
            raise HTTPException(
                status_code=500,
                detail=f"Ocurrió un error inesperado durante el procesamiento: {str(e)}"
            )

    def get_full_report_by_id(self, report_id: int):
        report = self.db.query(Report).filter(Report.id == report_id).first()

        if not report:
            raise HTTPException(status_code=404, detail="Reporte no encontrado")

        return report

    def get_processing_results(self, report_id: int):
        report = self.db.query(Report).filter(Report.id == report_id).first()

        if not report:
            raise HTTPException(status_code=404, detail="Reporte no encontrado")

        classification = (
            self.db.query(Classification)
            .filter(Classification.report_id == report_id)
            .first()
        )
        entities = (
            self.db.query(Entity)
            .filter(Entity.report_id == report_id)
            .all()
        )
        summary = (
            self.db.query(Summary)
            .filter(Summary.report_id == report_id)
            .first()
        )

        return {
            "classification": classification,
            "entities": entities,
            "summary": summary
        }

    def delete_report(self, report_id: int):
        report = self.db.query(Report).filter(Report.id == report_id).first()

        if not report:
            raise HTTPException(status_code=404, detail="Reporte no encontrado")

        self.db.delete(report)
        self.db.commit()

        return {"message": f"Reporte {report_id} eliminado correctamente"}