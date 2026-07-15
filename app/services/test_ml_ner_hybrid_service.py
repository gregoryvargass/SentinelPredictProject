from app.services.nlp_service import NLPService

service = NLPService()

examples = [
    "El operario resbaló en la zona de carga por presencia de aceite derramado en el piso.",
    "Se observó un cable expuesto junto a una máquina energizada en producción.",
    "Un trabajador presentó dolor lumbar luego de levantar cajas pesadas durante varias horas en el almacén.",
    "Se detectó fuga de solvente químico en un recipiente mal cerrado dentro del laboratorio.",
    "La mano del operador quedó atrapada parcialmente en una máquina prensadora durante la operación.",
    "Se reportó desorden general y señalización deficiente en un pasillo del área de despacho.",
]

for text in examples:
    print("\nTexto:", text)
    print("Entidades híbridas:")
    for entity in service.extract_entities(text):
        print(entity)
    print("-" * 80)