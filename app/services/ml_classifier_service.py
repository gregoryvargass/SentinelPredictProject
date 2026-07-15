import json
from pathlib import Path

import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer

BASE_DIR = Path(__file__).resolve().parents[2]
MODEL_DIR = BASE_DIR / "ml" / "models" / "incident_classifier"

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)
model.to(DEVICE)
model.eval()

with open(MODEL_DIR / "id2label.json", "r", encoding="utf-8") as f:
    id2label = json.load(f)

VISIBLE_LABELS = {
    "riesgo_caida": "Riesgo de caída",
    "riesgo_electrico": "Riesgo eléctrico",
    "riesgo_ergonomico": "Riesgo ergonómico",
    "riesgo_general": "Riesgo general",
    "riesgo_mecanico": "Riesgo mecánico",
    "riesgo_quimico": "Riesgo químico",
}


def classify_incident_text(text: str, top_k: int = 3) -> dict:
    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        max_length=256,
        padding=True,
    )

    inputs = {key: value.to(DEVICE) for key, value in inputs.items()}

    with torch.no_grad():
        outputs = model(**inputs)
        probabilities = torch.softmax(outputs.logits, dim=-1)[0]

    top_probs, top_ids = torch.topk(probabilities, top_k)

    top_predictions = []
    for prob, idx in zip(top_probs.tolist(), top_ids.tolist()):
        raw_label = id2label[str(idx)]
        top_predictions.append(
            {
                "label": raw_label,
                "label_display": VISIBLE_LABELS.get(raw_label, raw_label),
                "confidence": round(prob, 4),
            }
        )

    predicted_label = top_predictions[0]["label"]
    predicted_display = top_predictions[0]["label_display"]
    confidence = top_predictions[0]["confidence"]

    requires_review = confidence < 0.75

    return {
        "label": predicted_label,
        "label_display": predicted_display,
        "confidence": confidence,
        "requires_review": requires_review,
        "top_predictions": top_predictions,
    }