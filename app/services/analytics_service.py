from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.report import Report
from app.models.classification import Classification
from app.models.entity import Entity
from datetime import datetime

class AnalyticsService:
    def __init__(self, db: Session):
        self.db = db

    def _apply_date_filter(self, query, start_date: str | None = None, end_date: str | None = None):
        if start_date:
            start_dt = datetime.fromisoformat(start_date)
            query = query.filter(Report.incident_date >= start_dt)

        if end_date:
            end_dt = datetime.fromisoformat(end_date)
            end_dt = end_dt.replace(hour=23, minute=59, second=59)
            query = query.filter(Report.incident_date <= end_dt)

        return query

    def get_summary(self, start_date: str | None = None, end_date: str | None = None):
        reports_query = self.db.query(Report)
        reports_query = self._apply_date_filter(reports_query, start_date, end_date)

        filtered_reports = reports_query.all()
        filtered_report_ids = [report.id for report in filtered_reports]

        total_reports = len(filtered_reports)
        processed_reports = len([r for r in filtered_reports if r.status == "processed"])
        pending_reports = len([r for r in filtered_reports if r.status == "pending"])
        failed_reports = len([r for r in filtered_reports if r.status == "failed"])

        most_common_incident = None
        if filtered_report_ids:
            most_common_incident_row = (
                self.db.query(Classification.label, func.count(Classification.id).label("count"))
                .filter(Classification.report_id.in_(filtered_report_ids))
                .group_by(Classification.label)
                .order_by(func.count(Classification.id).desc())
                .first()
            )
            most_common_incident = most_common_incident_row[0] if most_common_incident_row else None

        most_affected_area = None
        if filtered_reports:
            area_counts = {}
            for report in filtered_reports:
                if report.area:
                    area_counts[report.area] = area_counts.get(report.area, 0) + 1

            if area_counts:
                most_affected_area = max(area_counts, key=area_counts.get)

        return {
            "total_reports": total_reports,
            "processed_reports": processed_reports,
            "pending_reports": pending_reports,
            "failed_reports": failed_reports,
            "most_common_incident": most_common_incident,
            "most_affected_area": most_affected_area,
        }

    def get_incidents_by_type(self, start_date: str | None = None, end_date: str | None = None):
        reports_query = self.db.query(Report.id)
        reports_query = self._apply_date_filter(reports_query, start_date, end_date)
        filtered_report_ids = [row[0] for row in reports_query.all()]

        if not filtered_report_ids:
            return []

        rows = (
            self.db.query(Classification.label, func.count(Classification.id).label("count"))
            .filter(Classification.report_id.in_(filtered_report_ids))
            .group_by(Classification.label)
            .order_by(func.count(Classification.id).desc())
            .all()
        )

        return [{"label": row[0], "count": row[1]} for row in rows]

    def get_incidents_by_area(self, start_date: str | None = None, end_date: str | None = None):
        query = self.db.query(Report)
        query = self._apply_date_filter(query, start_date, end_date)

        rows = (
            query.filter(Report.area.isnot(None))
            .with_entities(Report.area, func.count(Report.id).label("count"))
            .group_by(Report.area)
            .order_by(func.count(Report.id).desc())
            .all()
        )

        return [{"area": row[0], "count": row[1]} for row in rows]

    def get_top_entities(self, limit: int = 10, start_date: str | None = None, end_date: str | None = None):
        reports_query = self.db.query(Report.id)
        reports_query = self._apply_date_filter(reports_query, start_date, end_date)
        filtered_report_ids = [row[0] for row in reports_query.all()]

        if not filtered_report_ids:
            return []

        rows = (
            self.db.query(Entity.text, Entity.label, func.count(Entity.id).label("count"))
            .filter(Entity.report_id.in_(filtered_report_ids))
            .group_by(Entity.text, Entity.label)
            .order_by(func.count(Entity.id).desc())
            .limit(limit)
            .all()
        )

        return [{"text": row[0], "label": row[1], "count": row[2]} for row in rows]
    
    def get_dashboard_data(self, start_date: str | None = None, end_date: str | None = None):
        return {
            "summary": self.get_summary(start_date, end_date),
            "incidents_by_type": self.get_incidents_by_type(start_date, end_date),
            "incidents_by_area": self.get_incidents_by_area(start_date, end_date),
            "top_entities": self.get_top_entities(10, start_date, end_date),
            "recommendations": self.get_recommendations(start_date, end_date),
            "trends": self.get_trends(start_date, end_date),
        }

    def get_recommendations(self, start_date: str | None = None, end_date: str | None = None):
        recommendations = []

        reports_query = self.db.query(Report)
        reports_query = self._apply_date_filter(reports_query, start_date, end_date)
        filtered_reports = reports_query.all()
        filtered_report_ids = [report.id for report in filtered_reports]

        if not filtered_report_ids:
            return [
                {
                    "title": "Sin datos en el rango seleccionado",
                    "reason": "No se encontraron reportes dentro del período filtrado.",
                    "priority": "baja",
                }
            ]

        incident_counts = {
            row[0]: row[1]
            for row in self.db.query(Classification.label, func.count(Classification.id))
            .filter(Classification.report_id.in_(filtered_report_ids))
            .group_by(Classification.label)
            .all()
        }

        entity_counts = {
            (row[0], row[1]): row[2]
            for row in self.db.query(Entity.text, Entity.label, func.count(Entity.id))
            .filter(Entity.report_id.in_(filtered_report_ids))
            .group_by(Entity.text, Entity.label)
            .all()
        }

        area_counts = {}
        for report in filtered_reports:
            if report.area:
                area_counts[report.area] = area_counts.get(report.area, 0) + 1

        if incident_counts.get("Riesgo de caída", 0) > 0:
            fall_condition_mentions = (
                entity_counts.get(("líquido", "CONDICION"), 0)
                + entity_counts.get(("liquido", "CONDICION"), 0)
                + entity_counts.get(("superficie húmeda", "CONDICION"), 0)
                + entity_counts.get(("superficie humeda", "CONDICION"), 0)
                + entity_counts.get(("piso resbaloso", "CONDICION"), 0)
            )

            if fall_condition_mentions > 0:
                recommendations.append({
                    "title": "Reforzar control de superficies resbalosas",
                    "reason": "Se detectaron incidentes de caída asociados a líquido, humedad o superficies resbalosas.",
                    "priority": "alta"
                })

        if incident_counts.get("Riesgo químico", 0) > 0:
            recommendations.append({
                "title": "Revisar protocolos de manipulación de sustancias",
                "reason": "Se identificaron incidentes clasificados como riesgo químico.",
                "priority": "alta"
            })

        if incident_counts.get("Riesgo mecánico", 0) > 0:
            recommendations.append({
                "title": "Inspeccionar maquinaria y resguardos de seguridad",
                "reason": "Se detectaron incidentes asociados a riesgo mecánico.",
                "priority": "media"
            })

        if incident_counts.get("Riesgo eléctrico", 0) > 0:
            recommendations.append({
                "title": "Verificar cableado y procedimientos eléctricos",
                "reason": "Se identificaron incidentes asociados a riesgo eléctrico.",
                "priority": "alta"
            })

        if incident_counts.get("Riesgo ergonómico", 0) > 0:
            recommendations.append({
                "title": "Evaluar condiciones ergonómicas de trabajo",
                "reason": "Se detectaron incidentes relacionados con sobreesfuerzo o postura.",
                "priority": "media"
            })

        if area_counts:
            top_area = max(area_counts, key=area_counts.get)
            if area_counts[top_area] >= 2:
                recommendations.append({
                    "title": f"Realizar inspección preventiva en {top_area}",
                    "reason": f"El área {top_area} concentra la mayor cantidad de incidentes registrados en el rango seleccionado.",
                    "priority": "media"
                })

        if not recommendations:
            recommendations.append({
                "title": "Mantener monitoreo preventivo",
                "reason": "No se detectaron patrones críticos suficientes para generar una recomendación específica en el rango seleccionado.",
                "priority": "baja"
            })

        return recommendations

    def get_trends(self, start_date: str | None = None, end_date: str | None = None):
        query = self.db.query(
            func.date(Report.incident_date).label("date"),
            func.count(Report.id).label("count")
        ).filter(Report.incident_date.isnot(None))

        query = self._apply_date_filter(query, start_date, end_date)

        rows = (
            query.group_by(func.date(Report.incident_date))
            .order_by(func.date(Report.incident_date))
            .all()
        )

        return [{"date": str(row[0]), "count": row[1]} for row in rows]