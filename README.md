# SentinelPredict Backend

Backend del prototipo **SentinelPredict**, desarrollado con **FastAPI**, orientado al análisis automatizado de reportes narrativos de incidentes industriales.

## Descripción

SentinelPredict es un sistema prototipo que permite:

- Registrar reportes narrativos de incidentes industriales
- Almacenar reportes en una base de datos estructurada
- Procesar reportes mediante un pipeline NLP del MVP
- Generar:
  - clasificación automática del incidente
  - entidades relevantes detectadas
  - resumen del reporte
- Consultar resultados de procesamiento de forma individual o integrada

Este backend forma parte del proyecto de tesis orientado a la gestión predictiva de riesgos industriales mediante análisis automatizado de reportes narrativos.

---

## Tecnologías utilizadas

- Python 3.11
- FastAPI
- Uvicorn
- SQLAlchemy
- SQLite
- Pytest

---

## Estructura del proyecto

```bash
sentinelpredict-backend/
├── app/
│   ├── api/
│   │   ├── deps.py
│   │   └── routes/
│   │       └── reports.py
│   ├── core/
│   │   └── database.py
│   ├── models/
│   │   ├── report.py
│   │   ├── classification.py
│   │   ├── entity.py
│   │   └── summary.py
│   ├── schemas/
│   │   ├── report.py
│   │   ├── classification.py
│   │   ├── entity.py
│   │   ├── summary.py
│   │   ├── processing.py
│   │   └── process.py
│   ├── services/
│   │   ├── report_service.py
│   │   └── nlp_service.py
│   ├── scripts/
│   │   └── seed_data.py
│   ├── __init__.py
│   └── main.py
├── tests/
│   └── test_reports.py
├── pytest.ini
├── sentinelpredict.db
├── README.md
└── venv/

```
## Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

* Python 3.11 o superior
* pip
* VS Code o cualquier editor compatible

## Instalación del entorno

1. Clonar o abrir el proyecto

Ubícate en la carpeta raíz del proyecto.

2. Crear entorno virtual
```bash
python -m venv venv
```
3. Activar entorno virtual
En Windows PowerShell
```bash
.\venv\Scripts\Activate.ps1
```
En Windows CMD
```bash
venv\Scripts\activate
```
En Mac/Linux
```bash
source venv/bin/activate
```
4. Instalar dependencias
```bash
pip install fastapi uvicorn sqlalchemy pytest httpx requests
```

## Ejecución del servidor

Para iniciar el backend en modo desarrollo:
```bash
uvicorn app.main:app --reload
```
Si el servidor inicia correctamente, estará disponible en:
```bash
http://127.0.0.1:8000
```
## Documentación Swagger

Una vez iniciado el servidor, la documentación interactiva estará disponible en:
```bash
http://127.0.0.1:8000/docs
```
Esta interfaz permite probar todos los endpoints del sistema.

## Base de datos

El proyecto utiliza una base de datos SQLite local:
```bash
sentinelpredict.db
```
Las tablas se crean automáticamente al iniciar la aplicación.

## Carga de datos de prueba

Para insertar reportes de prueba en la base de datos, ejecutar:
```bash
python -m app.scripts.seed_data
```
Si ya existen registros, el script evitará duplicados.

## Endpoints principales

Sistema

- GET /
- GET /health

Reportes

- GET /reports/
- GET /reports/{report_id}
- GET /reports/{report_id}/full
- POST /reports/
- POST /reports/{report_id}/process
- GET /reports/{report_id}/results

## Flujo recomendado de demostración

Para demostrar el funcionamiento del backend se recomienda este flujo:

1. Verificar estado del sistema:
```bash
GET /health
```

2. Listar reportes:
```bash
GET /reports/
```

3. Consultar un reporte específico:
```bash
GET /reports/1
```
4. Procesar el reporte:
```bash
POST /reports/1/process
```
5. Consultar resultados del procesamiento:
```bash
GET /reports/1/results
```
6. Consultar detalle completo:
```bash
GET /reports/1/full
```
## Pruebas automatizadas

Para ejecutar las pruebas funcionales mínimas del backend:
```bash
python -m pytest -v
```
Estas pruebas validan:

* creación de reportes
* listado de reportes
* consulta por ID
* procesamiento del reporte
* consulta de resultados

## Estados de procesamiento

Los reportes pueden manejar los siguientes estados:

* pending: reporte creado pero no procesado
* processed: reporte procesado correctamente
* failed: error durante el procesamiento

## Consideraciones del MVP

Este backend corresponde a un Producto Mínimo Viable (MVP) del sistema SentinelPredict.

En esta etapa:

- el pipeline NLP utiliza lógica mock controlada para clasificación, extracción de entidades y resumen
- no se ha integrado todavía un modelo NLP final entrenado para producción
- el objetivo principal es demostrar la viabilidad técnica y funcional del sistema

## Autoría

Proyecto desarrollado como parte del trabajo de tesis SentinelPredict.