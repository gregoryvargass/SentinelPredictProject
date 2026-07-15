SentinelPredict NER Dataset v1

Formato:
Cada línea es un JSON con:
- id: identificador
- text: texto plano del reporte
- entities: lista de spans con:
  - start
  - end
  - label
  - text

Etiquetas:
PERSONA
AREA
EQUIPO
CONDICION
SUSTANCIA
EVENTO

Reglas de anotación:
1. Etiquetar solo spans explícitos.
2. Usar el span mínimo útil.
3. No solapar entidades.
4. Mantener consistencia léxica.
5. Este dataset sirve como base inicial para convertir a formato BIO y entrenar token classification.

Tamaños:
- total: 110
- train: 88
- val: 11
- test: 11
