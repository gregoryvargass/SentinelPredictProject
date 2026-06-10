from datetime import datetime
from app.core.database import SessionLocal
from app.models.report import Report


def seed_reports():
    db = SessionLocal()

    try:
        existing_reports = db.query(Report).count()

        if existing_reports > 0:
            print("Ya existen reportes en la base de datos. No se insertaron datos duplicados.")
            return

        reports = [
            # Riesgo de caída
            Report(
                title="Resbalón en área de producción",
                description="Un operario resbaló por presencia de líquido en el suelo durante el turno matutino en la planta de producción.",
                source="manual",
                area="Producción",
                incident_date=datetime(2026, 4, 1, 8, 30),
                status="pending"
            ),
            Report(
                title="Caída en zona de carga",
                description="El operador sufrió una caída al caminar sobre una superficie húmeda en la zona de carga.",
                source="manual",
                area="Logística",
                incident_date=datetime(2026, 4, 2, 10, 15),
                status="pending"
            ),

            # Riesgo químico
            Report(
                title="Derrame de sustancia química",
                description="Se detectó un derrame químico cerca del laboratorio, con exposición potencial a una sustancia peligrosa.",
                source="manual",
                area="Laboratorio",
                incident_date=datetime(2026, 4, 3, 14, 10),
                status="pending"
            ),
            Report(
                title="Fuga de solvente inflamable",
                description="Un técnico reportó fuga de solvente inflamable en el área de mezclado durante labores de inspección.",
                source="manual",
                area="Laboratorio",
                incident_date=datetime(2026, 4, 4, 9, 45),
                status="pending"
            ),

            # Riesgo mecánico
            Report(
                title="Golpe con herramienta en mantenimiento",
                description="Un trabajador recibió un golpe con una herramienta mientras realizaba mantenimiento de una máquina.",
                source="manual",
                area="Mantenimiento",
                incident_date=datetime(2026, 4, 5, 11, 20),
                status="pending"
            ),
            Report(
                title="Atrapamiento con banda transportadora",
                description="Se reportó atrapamiento parcial de un operario con una banda transportadora en la línea de producción.",
                source="manual",
                area="Producción",
                incident_date=datetime(2026, 4, 6, 13, 0),
                status="pending"
            ),

            # Riesgo eléctrico
            Report(
                title="Cable expuesto en panel eléctrico",
                description="Un supervisor identificó cable expuesto en un panel eléctrico próximo a un equipo energizado.",
                source="manual",
                area="Infraestructura",
                incident_date=datetime(2026, 4, 7, 8, 50),
                status="pending"
            ),
            Report(
                title="Descarga eléctrica durante revisión",
                description="Un técnico sufrió una descarga eléctrica leve al revisar conexiones de corriente en un equipo energizado.",
                source="manual",
                area="Infraestructura",
                incident_date=datetime(2026, 4, 8, 15, 5),
                status="pending"
            ),

            # Riesgo ergonómico
            Report(
                title="Sobreesfuerzo por levantamiento de carga",
                description="Un trabajador presentó sobreesfuerzo al realizar levantamiento de carga sin apoyo mecánico.",
                source="manual",
                area="Almacén",
                incident_date=datetime(2026, 4, 9, 7, 40),
                status="pending"
            ),
            Report(
                title="Molestia muscular por postura repetitiva",
                description="Se reportó fatiga muscular por postura inadecuada y movimiento repetitivo en estación de ensamblaje.",
                source="manual",
                area="Producción",
                incident_date=datetime(2026, 4, 10, 16, 20),
                status="pending"
            ),

            # Riesgo general
            Report(
                title="Condición insegura en área obstruida",
                description="Se identificó un área obstruida que dificultaba el paso seguro del personal durante la operación.",
                source="manual",
                area="Almacén",
                incident_date=datetime(2026, 4, 11, 10, 0),
                status="pending"
            ),
            Report(
                title="Incidente menor sin lesión",
                description="Se registró un incidente menor durante operación rutinaria, sin lesión, pero con necesidad de revisión preventiva.",
                source="manual",
                area="Logística",
                incident_date=datetime(2026, 4, 12, 12, 30),
                status="pending"
            ),
        ]

        db.add_all(reports)
        db.commit()

        print("Datos de prueba insertados correctamente.")

    finally:
        db.close()


if __name__ == "__main__":
    seed_reports()