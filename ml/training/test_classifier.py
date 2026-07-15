import json
from pathlib import Path

import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer

BASE_DIR = Path(__file__).resolve().parents[2]
MODEL_DIR = BASE_DIR / "ml" / "models" / "incident_classifier"

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)
model.to(device)
model.eval()

with open(MODEL_DIR / "id2label.json", "r", encoding="utf-8") as f:
    id2label = json.load(f)


def predict_top_k(text: str, k: int = 3):
    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        max_length=256,
        padding=True,
    )

    inputs = {key: value.to(device) for key, value in inputs.items()}

    with torch.no_grad():
        outputs = model(**inputs)
        probabilities = torch.softmax(outputs.logits, dim=-1)[0]

    top_probs, top_ids = torch.topk(probabilities, k)

    results = []
    for prob, idx in zip(top_probs.tolist(), top_ids.tolist()):
        label = id2label[str(idx)]
        results.append((label, prob))

    return results


if __name__ == "__main__":
    examples = [
        "El operario resbaló en el área de carga debido a un derrame de aceite en el piso.",
        "Se observó un cable expuesto conectado a una máquina cerca de una zona húmeda.",
        "Un trabajador presentó dolor lumbar luego de levantar cajas pesadas durante varias horas.",
        "Se detectó fuga de solvente químico en un recipiente mal cerrado dentro del almacén.",
        "La máquina prensadora atrapó parcialmente la mano del operador durante la operación.",
        "Se reportó una condición insegura general en el área de trabajo por desorden y mala señalización.",
    ]

    for idx, text in enumerate(examples, start=1):
        top_results = predict_top_k(text, k=3)

        print(f"\nEjemplo {idx}")
        print(f"Texto: {text}")
        print("Top 3 predicciones:")

        for rank, (label, prob) in enumerate(top_results, start=1):
            print(f"  {rank}. {label} -> {prob:.4f}")