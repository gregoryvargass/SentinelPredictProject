from app.core.database import SessionLocal
from app.models.report import Report
from app.services.report_service import ReportService


def process_all_reports():
    db = SessionLocal()

    try:
        service = ReportService(db)

        pending_reports = db.query(Report).filter(Report.status == "pending").all()

        if not pending_reports:
            print("No hay reportes pendientes para procesar.")
            return

        processed_count = 0
        failed_count = 0

        for report in pending_reports:
            try:
                result = service.process_report(report.id)
                print(f"Reporte {report.id}: {result['status']} - {result['message']}")
                if result["status"] == "processed":
                    processed_count += 1
            except Exception as e:
                failed_count += 1
                print(f"Error procesando reporte {report.id}: {str(e)}")

        print("\nProcesamiento masivo completado.")
        print(f"Procesados correctamente: {processed_count}")
        print(f"Fallidos: {failed_count}")

    finally:
        db.close()


if __name__ == "__main__":
    process_all_reports()