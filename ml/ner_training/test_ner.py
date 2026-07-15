from pathlib import Path

from transformers import pipeline

BASE_DIR = Path(__file__).resolve().parents[2]
MODEL_DIR = BASE_DIR / "ml" / "models" / "incident_ner"

ner_pipeline = pipeline(
    "token-classification",
    model=str(MODEL_DIR),
    tokenizer=str(MODEL_DIR),
    aggregation_strategy="simple",
)


def print_entities(text: str):
    results = ner_pipeline(text)

    print("\nTexto:")
    print(text)
    print("\nEntidades detectadas:")

    if not results:
        print("  No se detectaron entidades.")
        return

    for entity in results:
        label = entity.get("entity_group", "N/A")
        word = entity.get("word", "")
        score = entity.get("score", 0.0)
        start = entity.get("start", None)
        end = entity.get("end", None)

        print(
            f"  - {word} | {label} | score={score:.4f} | start={start} | end={end}"
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
        print("\n" + "-" * 80)