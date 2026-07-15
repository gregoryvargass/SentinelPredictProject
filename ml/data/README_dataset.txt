SentinelPredict Dataset v3 (correctivo)

Contenido:
- incident_reports_corrective_additional.csv: ejemplos nuevos orientados a corregir clases problemáticas
- incident_reports_classification_full.csv: dataset v2 + ejemplos correctivos v3
- incident_reports_train.csv: partición de entrenamiento
- incident_reports_val.csv: partición de validación
- incident_reports_test.csv: partición de prueba

Objetivo:
Esta versión refuerza principalmente las clases:
- riesgo_caida
- riesgo_mecanico
- riesgo_general
- riesgo_electrico

Uso recomendado:
1. Reemplazar los CSV anteriores en ml/data/ por train, val y test de esta carpeta.
2. Reentrenar el modelo con python ml/training/train_classifier.py
3. Repetir la evaluación manual con los 20 casos.
