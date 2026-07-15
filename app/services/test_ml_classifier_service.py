from app.services.ml_classifier_service import classify_incident_text

examples = [
    "El operario resbaló en el área de carga debido a un derrame de aceite en el piso.",
    "Se observó un cable expuesto conectado a una máquina cerca de una zona húmeda.",
    "Un trabajador presentó dolor lumbar luego de levantar cajas pesadas durante varias horas.",
]

for text in examples:
    result = classify_incident_text(text)
    print("\nTexto:", text)
    print("Resultado:", result)