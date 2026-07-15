from pathlib import Path
import re

from transformers import pipeline

BASE_DIR = Path(__file__).resolve().parents[2]
MODEL_DIR = BASE_DIR / "ml" / "models" / "incident_ner"

MIN_SCORE = 0.50

AREA_BLACKLIST = {"piso", "operación", "operacion"}
EQUIPO_BLACKLIST = {"mano", "caja", "cajas"}
CONDICION_BLACKLIST = {"general"}
SUSTANCIA_BLACKLIST = {"deficiente"}

ALLOWED_LABELS = {
    "PERSONA",
    "AREA",
    "EQUIPO",
    "CONDICION",
    "SUSTANCIA",
    "EVENTO",
}

ner_pipeline = pipeline(
    "token-classification",
    model=str(MODEL_DIR),
    tokenizer=str(MODEL_DIR),
    aggregation_strategy="simple",
)


def is_word_boundary(text: str, start: int, end: int) -> bool:
    left_ok = start == 0 or not text[start - 1].isalnum()
    right_ok = end == len(text) or not text[end:end + 1].isalnum()
    return left_ok and right_ok


def normalize_span(span: str) -> str:
    span = span.strip()
    span = re.sub(r"\s+", " ", span)
    return span


def infer_label_from_text(span: str, current_label: str) -> str:
    value = span.lower()

    person_terms = [
        "operario", "operador", "trabajador", "técnico", "tecnico", "supervisor"
    ]
    area_terms = [
        "zona de carga", "laboratorio", "producción", "produccion",
        "almacén", "almacen", "área de despacho", "area de despacho",
        "pasillo", "planta de producción", "planta de produccion"
    ]
    equipment_terms = [
        "máquina prensadora", "maquina prensadora", "máquina", "maquina",
        "panel eléctrico", "panel electrico", "herramienta",
        "banda transportadora", "montacargas", "equipo energizado"
    ]
    condition_terms = [
        "cable expuesto", "piso húmedo", "piso humedo",
        "superficie resbalosa", "superficie resbaloso",
        "señalización deficiente", "senalizacion deficiente",
        "recipiente mal cerrado", "área obstruida", "area obstruida",
        "desorden general", "superficie húmeda", "superficie humeda"
    ]
    substance_terms = [
        "aceite", "solvente", "ácido", "acido", "químico", "quimico",
        "sustancia", "líquido inflamable", "liquido inflamable",
        "vapores", "líquido", "liquido"
    ]
    event_terms = [
        "resbaló", "resbalo", "resbalón", "resbalon", "caída", "caida",
        "tropezó", "tropezo", "golpe", "derrame", "fuga",
        "atrapamiento", "descarga"
    ]

    if any(term in value for term in person_terms):
        return "PERSONA"
    if any(term in value for term in area_terms):
        return "AREA"
    if any(term in value for term in equipment_terms):
        return "EQUIPO"
    if any(term in value for term in condition_terms):
        return "CONDICION"
    if any(term in value for term in substance_terms):
        return "SUSTANCIA"
    if any(term in value for term in event_terms):
        return "EVENTO"

    return current_label


def is_valid_entity(text: str, entity: dict) -> bool:
    label = entity["label"]
    span = entity["text"].lower()
    score = entity["confidence"]
    start = entity["start_char"]
    end = entity["end_char"]

    if label not in ALLOWED_LABELS:
        return False

    if score < MIN_SCORE:
        return False

    if len(span) < 4:
        return False

    if "##" in span:
        return False

    if not is_word_boundary(text, start, end):
        return False

    if label == "AREA" and span in AREA_BLACKLIST:
        return False

    if label == "EQUIPO" and span in EQUIPO_BLACKLIST:
        return False

    if label == "CONDICION" and span in CONDICION_BLACKLIST:
        return False

    if label == "SUSTANCIA" and span in SUSTANCIA_BLACKLIST:
        return False

    return True


def deduplicate_entities(entities: list[dict]) -> list[dict]:
    cleaned = []
    seen = set()

    for entity in entities:
        key = (
            entity["text"].lower(),
            entity["label"],
            entity["start_char"],
            entity["end_char"],
        )
        if key not in seen:
            seen.add(key)
            cleaned.append(entity)

    cleaned.sort(key=lambda x: (x["start_char"], x["end_char"]))
    return cleaned


def extract_entities_ml(text: str) -> list[dict]:
    if not text or not text.strip():
        raise ValueError("El texto del reporte está vacío y no permite extracción de entidades")

    raw_results = ner_pipeline(text)
    entities = []

    for item in raw_results:
        start = item.get("start")
        end = item.get("end")
        label = item.get("entity_group")
        score = float(item.get("score", 0.0))

        if start is None or end is None or label is None:
            continue

        original_span = normalize_span(text[start:end])
        corrected_label = infer_label_from_text(original_span, label)

        entity = {
            "text": original_span,
            "label": corrected_label,
            "start_char": start,
            "end_char": end,
            "confidence": round(score, 4),
        }

        if is_valid_entity(text, entity):
            entities.append(entity)

    return deduplicate_entities(entities)