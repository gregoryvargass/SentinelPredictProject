import json
import os
from pathlib import Path

import evaluate
import numpy as np
import pandas as pd
from datasets import Dataset
from transformers import (
    AutoModelForSequenceClassification,
    AutoTokenizer,
    DataCollatorWithPadding,
    Trainer,
    TrainingArguments,
)

BASE_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = BASE_DIR / "ml" / "data"
MODEL_DIR = BASE_DIR / "ml" / "models" / "incident_classifier"
OUTPUT_DIR = BASE_DIR / "ml" / "outputs" / "incident_classifier"

TRAIN_FILE = DATA_DIR / "incident_reports_train.csv"
VAL_FILE = DATA_DIR / "incident_reports_val.csv"
TEST_FILE = DATA_DIR / "incident_reports_test.csv"

MODEL_NAME = "distilbert-base-multilingual-cased"
TEXT_COLUMN = "text"
LABEL_COLUMN = "label"
MAX_LENGTH = 256


def load_data() -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    train_df = pd.read_csv(TRAIN_FILE)
    val_df = pd.read_csv(VAL_FILE)
    test_df = pd.read_csv(TEST_FILE)

    required_columns = {TEXT_COLUMN, LABEL_COLUMN}

    for name, df in [("train", train_df), ("val", val_df), ("test", test_df)]:
        if not required_columns.issubset(df.columns):
            raise ValueError(
                f"El archivo {name} no contiene las columnas requeridas: {required_columns}"
            )

        df.dropna(subset=[TEXT_COLUMN, LABEL_COLUMN], inplace=True)
        df[TEXT_COLUMN] = df[TEXT_COLUMN].astype(str)
        df[LABEL_COLUMN] = df[LABEL_COLUMN].astype(str)

    return train_df, val_df, test_df


def build_label_maps(train_df: pd.DataFrame) -> tuple[dict[str, int], dict[int, str]]:
    labels = sorted(train_df[LABEL_COLUMN].unique().tolist())
    label2id = {label: idx for idx, label in enumerate(labels)}
    id2label = {idx: label for label, idx in label2id.items()}
    return label2id, id2label


def encode_labels(df: pd.DataFrame, label2id: dict[str, int]) -> pd.DataFrame:
    df = df.copy()
    df["labels"] = df[LABEL_COLUMN].map(label2id)
    if df["labels"].isnull().any():
        missing = df[df["labels"].isnull()][LABEL_COLUMN].unique().tolist()
        raise ValueError(f"Se encontraron etiquetas desconocidas: {missing}")
    df["labels"] = df["labels"].astype(int)
    return df


def tokenize_function(examples, tokenizer):
    return tokenizer(
        examples[TEXT_COLUMN],
        truncation=True,
        max_length=MAX_LENGTH,
    )


def main():
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    print("Cargando dataset...")
    train_df, val_df, test_df = load_data()

    print("Construyendo etiquetas...")
    label2id, id2label = build_label_maps(train_df)

    train_df = encode_labels(train_df, label2id)
    val_df = encode_labels(val_df, label2id)
    test_df = encode_labels(test_df, label2id)

    print("Etiquetas encontradas:")
    print(label2id)

    print("Cargando tokenizer y modelo...")
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    model = AutoModelForSequenceClassification.from_pretrained(
        MODEL_NAME,
        num_labels=len(label2id),
        id2label=id2label,
        label2id=label2id,
    )

    train_dataset = Dataset.from_pandas(train_df[[TEXT_COLUMN, "labels"]], preserve_index=False)
    val_dataset = Dataset.from_pandas(val_df[[TEXT_COLUMN, "labels"]], preserve_index=False)
    test_dataset = Dataset.from_pandas(test_df[[TEXT_COLUMN, "labels"]], preserve_index=False)

    print("Tokenizando datasets...")
    train_dataset = train_dataset.map(lambda x: tokenize_function(x, tokenizer), batched=True)
    val_dataset = val_dataset.map(lambda x: tokenize_function(x, tokenizer), batched=True)
    test_dataset = test_dataset.map(lambda x: tokenize_function(x, tokenizer), batched=True)

    data_collator = DataCollatorWithPadding(tokenizer=tokenizer)

    accuracy_metric = evaluate.load("accuracy")
    f1_metric = evaluate.load("f1")
    precision_metric = evaluate.load("precision")
    recall_metric = evaluate.load("recall")

    def compute_metrics(eval_pred):
        logits, labels = eval_pred
        predictions = np.argmax(logits, axis=-1)

        accuracy = accuracy_metric.compute(predictions=predictions, references=labels)
        f1 = f1_metric.compute(predictions=predictions, references=labels, average="weighted")
        precision = precision_metric.compute(
            predictions=predictions,
            references=labels,
            average="weighted",
            zero_division=0,
        )
        recall = recall_metric.compute(
            predictions=predictions,
            references=labels,
            average="weighted",
            zero_division=0,
        )

        return {
            "accuracy": accuracy["accuracy"],
            "f1_weighted": f1["f1"],
            "precision_weighted": precision["precision"],
            "recall_weighted": recall["recall"],
        }

    training_args = TrainingArguments(
        output_dir=str(OUTPUT_DIR),
        eval_strategy="epoch",
        save_strategy="epoch",
        logging_strategy="epoch",
        learning_rate=2e-5,
        per_device_train_batch_size=8,
        per_device_eval_batch_size=8,
        num_train_epochs=4,
        weight_decay=0.01,
        load_best_model_at_end=True,
        metric_for_best_model="f1_weighted",
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

    print("Entrenando modelo...")
    trainer.train()

    print("Evaluando en test...")
    test_metrics = trainer.evaluate(test_dataset)

    print("Guardando modelo final...")
    trainer.save_model(str(MODEL_DIR))
    tokenizer.save_pretrained(str(MODEL_DIR))

    with open(MODEL_DIR / "label2id.json", "w", encoding="utf-8") as f:
        json.dump(label2id, f, ensure_ascii=False, indent=2)

    with open(MODEL_DIR / "id2label.json", "w", encoding="utf-8") as f:
        json.dump(id2label, f, ensure_ascii=False, indent=2)

    with open(OUTPUT_DIR / "test_metrics.json", "w", encoding="utf-8") as f:
        json.dump(test_metrics, f, ensure_ascii=False, indent=2)

    print("\nEntrenamiento completado.")
    print(f"Modelo guardado en: {MODEL_DIR}")
    print(f"Métricas guardadas en: {OUTPUT_DIR / 'test_metrics.json'}")
    print("Resultados de test:")
    print(test_metrics)


if __name__ == "__main__":
    main()