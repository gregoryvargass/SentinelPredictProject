Dataset inicial de clasificación para SentinelPredict

Archivos:
- incident_reports_classification_full.csv
- incident_reports_train.csv
- incident_reports_val.csv
- incident_reports_test.csv

Columnas:
- id: identificador interno
- text: reporte narrativo del incidente
- label: categoría del incidente

Etiquetas incluidas:
- riesgo_caida
- riesgo_quimico
- riesgo_mecanico
- riesgo_ergonomico
- riesgo_electrico
- riesgo_general

Cantidad total:
- 240 reportes
- 40 por categoría

Nota:
Este dataset fue preparado como base inicial para entrenamiento y prueba del MVP.
Es útil para construir el pipeline de clasificación, pero luego conviene enriquecerlo
con reportes reales anonimizados y revisión experta del etiquetado.
