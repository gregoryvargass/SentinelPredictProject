from datetime import datetime, timedelta

from app.core.database import SessionLocal, engine, Base
from app.models.report import Report
from app.models.classification import Classification
from app.models.entity import Entity
from app.models.summary import Summary
from app.services.nlp_service import NLPService


def build_reports():
    reports = []

    caida_reports = [
        ("Resbalón en zona de carga", "El operario resbaló en la zona de carga por presencia de líquido en el piso húmedo."),
        ("Caída por superficie resbalosa", "Un trabajador sufrió una caída al caminar sobre una superficie resbalosa en producción."),
        ("Tropezón en almacén", "El operador tropezó con material mal ubicado y cayó en el almacén principal."),
        ("Caída cerca de montacargas", "El técnico resbaló cerca del montacargas debido a una fuga que dejó el piso resbaloso."),
        ("Pérdida de equilibrio en laboratorio", "El supervisor perdió estabilidad y cayó al desplazarse por suelo húmedo en el laboratorio."),
        ("Resbalón en pasillo interno", "Un trabajador se resbaló en el pasillo interno por una superficie mojada no señalizada."),
        ("Caída durante inspección", "Durante la inspección, el operario cayó al pisar una zona con aceite derramado."),
        ("Tropezón con obstrucción", "El técnico tropezó con una caja fuera de lugar y cayó en el área obstruida."),
        ("Caída en producción", "El operador sufrió una caída en planta de producción por piso húmedo y falta de advertencia."),
        ("Resbalón en área de despacho", "Un trabajador resbaló en el área de despacho al pasar por una superficie resbalosa."),
    ]

    electrico_reports = [
        ("Cable expuesto en producción", "Se observó un cable expuesto conectado a una máquina en la planta de producción."),
        ("Riesgo en panel eléctrico", "El supervisor reportó anomalía en el panel eléctrico cercano a una zona húmeda."),
        ("Equipo energizado sin aislamiento", "El técnico manipuló un equipo energizado con aislamiento deficiente."),
        ("Posible cortocircuito", "Se detectó olor a quemado y posible cortocircuito en un panel electrico del almacén."),
        ("Corriente en herramienta", "Una herramienta presentó paso de corriente durante una prueba operativa."),
        ("Cableado deteriorado", "El operario detectó cable deteriorado en una máquina junto a líquido en el suelo."),
        ("Descarga leve en laboratorio", "Se reportó una descarga leve al tocar un equipo energizado en el laboratorio."),
        ("Conexión insegura", "El trabajador identificó una conexión insegura con cable expuesto detrás del panel eléctrico."),
        ("Riesgo por humedad", "Había humedad cerca de cables eléctricos y un equipo energizado en producción."),
        ("Falla en tablero", "Se registró falla en tablero con riesgo eléctrico por presencia de corriente y mala protección."),
    ]

    ergonomico_reports = [
        ("Dolor lumbar por carga", "Un trabajador presentó dolor lumbar tras el levantamiento de carga repetitivo."),
        ("Sobreesfuerzo en almacén", "El operario realizó levantamiento manual de cajas pesadas y presentó sobreesfuerzo."),
        ("Fatiga muscular", "Se reportó fatiga muscular luego de mover carga durante varias horas."),
        ("Postura inadecuada", "El técnico mantuvo postura forzada durante una tarea prolongada en laboratorio."),
        ("Movimiento repetitivo", "La actividad implicó movimiento repetitivo y provocó molestia en hombro y espalda."),
        ("Lesión por levantamiento", "Se notificó dolor por levantamiento de materiales con mala postura."),
        ("Carga manual excesiva", "El operador manipuló carga de forma manual y desarrolló fatiga muscular."),
        ("Postura sostenida", "La trabajadora mantuvo postura incómoda en estación de trabajo y presentó sobreesfuerzo."),
        ("Dolor por tareas repetidas", "El movimiento repetitivo en línea de producción generó dolor lumbar."),
        ("Ergonomía deficiente", "Se reportó riesgo ergonómico asociado a carga, postura y levantamiento frecuente."),
    ]

    mecanico_reports = [
        ("Atrapamiento en máquina", "La mano del operario quedó atrapada en una máquina con pieza móvil."),
        ("Golpe con herramienta", "Un trabajador sufrió golpe con herramienta durante ajuste de equipo."),
        ("Incidente en banda transportadora", "Se reportó riesgo en banda transportadora por exposición de pieza móvil."),
        ("Golpe durante operación", "El operador recibió golpe al manipular maquinaria en funcionamiento."),
        ("Riesgo por máquina sin guarda", "La máquina operaba sin protección adecuada y provocó atrapamiento."),
        ("Falla en equipo mecánico", "Se detectó riesgo mecánico por herramienta defectuosa y partes móviles expuestas."),
        ("Contacto con pieza móvil", "El técnico tuvo contacto cercano con una pieza móvil de la máquina."),
        ("Golpe en línea de producción", "Un trabajador sufrió golpe en brazo durante ajuste de una máquina."),
        ("Atrapamiento parcial", "La maquinaria generó atrapamiento parcial por maniobra insegura del operario."),
        ("Peligro en herramienta industrial", "Se reportó herramienta industrial con funcionamiento irregular y riesgo mecánico."),
    ]

    quimico_reports = [
        ("Derrame de solvente", "Se produjo derrame de solvente inflamable en el laboratorio."),
        ("Exposición a sustancia química", "El operario estuvo expuesto a sustancia química por envase mal cerrado."),
        ("Fuga de ácido", "Se detectó fuga de ácido en recipiente almacenado de forma inadecuada."),
        ("Vapores peligrosos", "El supervisor reportó vapores de químico en el área sin ventilación."),
        ("Derrame en almacén químico", "Hubo derrame de líquido inflamable dentro del almacén de sustancias."),
        ("Salpicadura de solvente", "Un trabajador recibió salpicadura de solvente durante manipulación."),
        ("Contenedor con fuga", "Se encontró contenedor con fuga de sustancia química en producción."),
        ("Riesgo por químico", "Se identificó exposición a químico volátil y presencia de vapores."),
        ("Ácido mal almacenado", "El ácido estaba mal almacenado y generó riesgo químico en laboratorio."),
        ("Derrame menor", "Se reportó derrame menor de sustancia inflamable cerca del área operativa."),
    ]

    general_reports = [
        ("Desorden en área operativa", "Se reportó condición insegura general por desorden en el área de trabajo."),
        ("Mala señalización", "La zona presentaba mala señalización y obstaculizaba la circulación del personal."),
        ("Área obstruida", "Se encontró área obstruida con materiales fuera de lugar."),
        ("Falta de orden", "El supervisor reportó falta de orden y limpieza en la planta de producción."),
        ("Condición insegura general", "Se identificó una condición insegura general durante la inspección rutinaria."),
        ("Pasillo bloqueado", "Había equipos y cajas bloqueando el paso en una ruta de circulación."),
        ("Deficiencia de organización", "El trabajador reportó desorden, materiales sueltos y señalización deficiente."),
        ("Riesgo general en almacén", "Se observó riesgo general en almacén por mala disposición de objetos."),
        ("Incumplimiento visual", "El área tenía señalización poco visible y desorden operativo."),
        ("Observación preventiva", "Se registró observación preventiva por desorden y falta de delimitación."),
    ]

    categorized = [
        ("Zona de carga", "manual", caida_reports),
        ("Producción", "manual", electrico_reports),
        ("Almacén", "manual", ergonomico_reports),
        ("Planta de producción", "manual", mecanico_reports),
        ("Laboratorio", "manual", quimico_reports),
        ("Producción", "manual", general_reports),
    ]

    base_date = datetime(2026, 5, 1, 8, 0, 0)

    counter = 1
    for area, source, category_reports in categorized:
        for idx, (title, description) in enumerate(category_reports):
            reports.append(
                {
                    "title": title,
                    "description": description,
                    "source": source,
                    "area": area,
                    "incident_date": base_date + timedelta(days=idx + counter),
                }
            )
            counter += 1

    return reports


def seed_visual_data():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    nlp_service = NLPService()

    try:
        # Limpia datos previos
        db.query(Entity).delete()
        db.query(Summary).delete()
        db.query(Classification).delete()
        db.query(Report).delete()
        db.commit()

        reports_data = build_reports()

        for report_data in reports_data:
            report = Report(
                title=report_data["title"],
                description=report_data["description"],
                source=report_data["source"],
                area=report_data["area"],
                incident_date=report_data["incident_date"],
                status="pending",
            )
            db.add(report)
            db.flush()

            classification_result = nlp_service.classify_report(report.description)
            entities_result = nlp_service.extract_entities(report.description)
            summary_result = nlp_service.summarize_report(report.description)

            classification = Classification(
                report_id=report.id,
                label=classification_result["label"],
                raw_label=classification_result["raw_label"],
                confidence=classification_result["confidence"],
                requires_review=classification_result["requires_review"],
                model_name=classification_result["model_name"],
            )
            db.add(classification)

            summary = Summary(
                report_id=report.id,
                content=summary_result["content"],
                model_name=summary_result["model_name"],
            )
            db.add(summary)

            for entity_data in entities_result:
                entity = Entity(
                    report_id=report.id,
                    text=entity_data["text"],
                    label=entity_data["label"],
                    start_char=entity_data["start_char"],
                    end_char=entity_data["end_char"],
                    confidence=entity_data["confidence"],
                )
                db.add(entity)

            report.status = "processed"

        db.commit()
        print(f"Se insertaron y procesaron {len(reports_data)} reportes de prueba.")

    except Exception as e:
        db.rollback()
        print(f"Error durante el seed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_visual_data()