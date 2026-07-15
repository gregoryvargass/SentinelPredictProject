from pathlib import Path
import re
from transformers import pipeline

BASE_DIR = Path(__file__).resolve().parents[2]
MODEL_DIR = BASE_DIR / "ml" / "models" / "incident_ner"

ner_pipeline = pipeline(
    "token-classification",
    model=str(MODEL_DIR),
    tokenizer=str(MODEL_DIR),
    aggregation_strategy="simple",
)

MIN_SCORE = 0.60

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


def is_word_boundary(text: str, start: int, end: int) -> bool:
    left_ok = start == 0 or not text[start - 1].isalnum()
    right_ok = end == len(text) or not text[end:end + 1].isalnum()
    return left_ok and right_ok


def normalize_span(span: str) -> str:
    span = span.strip()
    span = re.sub(r"\s+", " ", span)
    return span


def is_valid_entity(text: str, entity: dict) -> bool:
    label = entity["label"]
    span = entity["text"].lower()
    score = entity["score"]
    start = entity["start"]
    end = entity["end"]

    if label not in ALLOWED_LABELS:
        return False

    if score < MIN_SCORE:
        return False

    if len(span) < 4:
        return False

    if not is_word_boundary(text, start, end):
        return False

    if "##" in span:
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
        key = (entity["text"].lower(), entity["label"], entity["start"], entity["end"])
        if key not in seen:
            seen.add(key)
            cleaned.append(entity)

    return cleaned


def postprocess_entities(text: str, raw_results: list[dict]) -> list[dict]:
    entities = []

    for item in raw_results:
        start = item.get("start")
        end = item.get("end")
        label = item.get("entity_group")
        score = float(item.get("score", 0.0))

        if start is None or end is None or label is None:
            continue

        original_span = normalize_span(text[start:end])

        entity = {
            "text": original_span,
            "label": label,
            "score": round(score, 4),
            "start": start,
            "end": end,
        }

        if is_valid_entity(text, entity):
            entities.append(entity)

    return deduplicate_entities(entities)


def print_entities(text: str):
    raw_results = ner_pipeline(text)
    cleaned_results = postprocess_entities(text, raw_results)

    print("\nTexto:")
    print(text)

    print("\nSalida cruda:")
    if not raw_results:
        print("  No se detectaron entidades.")
    else:
        for entity in raw_results:
            print(
                f"  - {entity.get('word', '')} | "
                f"{entity.get('entity_group', 'N/A')} | "
                f"score={entity.get('score', 0.0):.4f} | "
                f"start={entity.get('start')} | end={entity.get('end')}"
            )

    print("\nSalida postprocesada:")
    if not cleaned_results:
        print("  No se detectaron entidades válidas.")
    else:
        for entity in cleaned_results:
            print(
                f"  - {entity['text']} | {entity['label']} | "
                f"score={entity['score']:.4f} | "
                f"start={entity['start']} | end={entity['end']}"
            )


if __name__ == "__main__":
    examples = [
        "El operario resbaló en la zona de carga por presencia de aceite derramado en el piso.",
        "Se observó un cable expuesto junto a una máquina energizada en producción.",
        "Un trabajador presentó dolor lumbar luego de levantar cajas pesadas durante varias horas en el almacén.",
        "Se detectó fuga de solvente químico en un recipiente mal cerrado dentro del laboratorio.",
        "La mano del operador quedó atrapada parcialmente en una máquina prensadora durante la operación.",
        "Se reportó desorden general y señalización deficiente en un pasillo del área de despacho.",
    ]

    for text in examples:
        print_entities(text)
        print("\n" + "-" * 100)