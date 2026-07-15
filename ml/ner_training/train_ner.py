import json
from pathlib import Path

import evaluate
import numpy as np
from datasets import Dataset
from transformers import (
    AutoModelForTokenClassification,
    AutoTokenizer,
    DataCollatorForTokenClassification,
    Trainer,
    TrainingArguments,
)

BASE_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = BASE_DIR / "ml" / "ner_data"
MODEL_DIR = BASE_DIR / "ml" / "models" / "incident_ner"
OUTPUT_DIR = BASE_DIR / "ml" / "outputs" / "incident_ner"

TRAIN_FILE = DATA_DIR / "incident_reports_ner_train.jsonl"
VAL_FILE = DATA_DIR / "incident_reports_ner_val.jsonl"
TEST_FILE = DATA_DIR / "incident_reports_ner_test.jsonl"

MODEL_NAME = "distilbert-base-multilingual-cased"
MAX_LENGTH = 256

ENTITY_TYPES = [
    "PERSONA",
    "AREA",
    "EQUIPO",
    "CONDICION",
    "SUSTANCIA",
    "EVENTO",
]


def load_jsonl(path: Path):
    records = []
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                records.append(json.loads(line))
    return records


def build_label_list():
    labels = ["O"]
    for entity in ENTITY_TYPES:
        labels.append(f"B-{entity}")
        labels.append(f"I-{entity}")
    return labels


LABEL_LIST = build_label_list()
LABEL2ID = {label: idx for idx, label in enumerate(LABEL_LIST)}
ID2LABEL = {idx: label for label, idx in LABEL2ID.items()}


def find_entity_for_token(token_start, token_end, entities):
    for entity in entities:
        ent_start = entity["start"]
        ent_end = entity["end"]
        ent_label = entity["label"]

        overlaps = max(token_start, ent_start) < min(token_end, ent_end)
        if overlaps:
            if token_start == ent_start:
                return f"B-{ent_label}"
            return f"I-{ent_label}"

    return "O"


def tokenize_and_align_labels(examples, tokenizer):
    tokenized = tokenizer(
        examples["text"],
        truncation=True,
        max_length=MAX_LENGTH,
        return_offsets_mapping=True,
    )

    all_labels = []

    for i, offsets in enumerate(tokenized["offset_mapping"]):
        entities = examples["entities"][i]
        sample_labels = []

        for start, end in offsets:
            # tokens especiales
            if start == 0 and end == 0:
                sample_labels.append(-100)
                continue

            label = find_entity_for_token(start, end, entities)
            sample_labels.append(LABEL2ID[label])

        all_labels.append(sample_labels)

    tokenized["labels"] = all_labels
    tokenized.pop("offset_mapping")

    return tokenized


def compute_metrics(eval_pred):
    seqeval = evaluate.load("seqeval")

    predictions, labels = eval_pred
    predictions = np.argmax(predictions, axis=2)

    true_predictions = []
    true_labels = []

    for prediction, label in zip(predictions, labels):
        current_predictions = []
        current_labels = []

        for pred_id, label_id in zip(prediction, label):
            if label_id == -100:
                continue

            current_predictions.append(ID2LABEL[int(pred_id)])
            current_labels.append(ID2LABEL[int(label_id)])

        true_predictions.append(current_predictions)
        true_labels.append(current_labels)

    results = seqeval.compute(predictions=true_predictions, references=true_labels)

    return {
        "precision": results["overall_precision"],
        "recall": results["overall_recall"],
        "f1": results["overall_f1"],
        "accuracy": results["overall_accuracy"],
    }


def main():
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    print("Cargando datasets NER...")
    train_records = load_jsonl(TRAIN_FILE)
    val_records = load_jsonl(VAL_FILE)
    test_records = load_jsonl(TEST_FILE)

    train_dataset = Dataset.from_list(train_records)
    val_dataset = Dataset.from_list(val_records)
    test_dataset = Dataset.from_list(test_records)

    print("Cargando tokenizer y modelo...")
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    model = AutoModelForTokenClassification.from_pretrained(
        MODEL_NAME,
        num_labels=len(LABEL_LIST),
        id2label=ID2LABEL,
        label2id=LABEL2ID,
    )

    print("Tokenizando y alineando etiquetas...")
    train_dataset = train_dataset.map(
        lambda examples: tokenize_and_align_labels(examples, tokenizer),
        batched=True,
        remove_columns=train_dataset.column_names,
    )
    val_dataset = val_dataset.map(
        lambda examples: tokenize_and_align_labels(examples, tokenizer),
        batched=True,
        remove_columns=val_dataset.column_names,
    )
    test_dataset = test_dataset.map(
        lambda examples: tokenize_and_align_labels(examples, tokenizer),
        batched=True,
        remove_columns=test_dataset.column_names,
    )

    data_collator = DataCollatorForTokenClassification(tokenizer=tokenizer)

    training_args = TrainingArguments(
        output_dir=str(OUTPUT_DIR),
        eval_strategy="epoch",
        save_strategy="epoch",
        logging_strategy="epoch",
        learning_rate=2e-5,
        per_device_train_batch_size=8,
        per_device_eval_batch_size=8,
        num_train_epochs=5,
        weight_decay=0.01,
        load_best_model_at_end=True,
        metric_for_best_model="f1",
        greater_is_better=True,
        save_total_limit=2,
        report_to="none",
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=val_dataset,
        data_collator=data_collator,
        compute_metrics=compute_metrics,
    )

    print("Entrenando modelo NER...")
    trainer.train()

    print("Evaluando en test...")
    test_metrics = trainer.evaluate(test_dataset)

    print("Guardando modelo final...")
    trainer.save_model(str(MODEL_DIR))
    tokenizer.save_pretrained(str(MODEL_DIR))

    with open(MODEL_DIR / "label2id.json", "w", encoding="utf-8") as f:
        json.dump(LABEL2ID, f, ensure_ascii=False, indent=2)

    with open(MODEL_DIR / "id2label.json", "w", encoding="utf-8") as f:
        json.dump(ID2LABEL, f, ensure_ascii=False, indent=2)

    with open(OUTPUT_DIR / "test_metrics.json", "w", encoding="utf-8") as f:
        json.dump(test_metrics, f, ensure_ascii=False, indent=2)

    print("\nEntrenamiento NER completado.")
    print(f"Modelo guardado en: {MODEL_DIR}")
    print(f"Métricas guardadas en: {OUTPUT_DIR / 'test_metrics.json'}")
    print("Resultados de test:")
    print(test_metrics)


if __name__ == "__main__":
    main()