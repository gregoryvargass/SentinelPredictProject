from fastapi import FastAPI
from app.api.routes import reports, analytics
from app.core.database import Base, engine
import app.models
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SentinelPredict API",
    description="""
API backend para el análisis automatizado de reportes narrativos de incidentes industriales.

Funciones principales:
- Registro de reportes narrativos
- Consulta de reportes almacenados
- Procesamiento de reportes mediante pipeline NLP
- Obtención de clasificación, entidades detectadas y resumen
- Consulta de resultados completos del procesamiento
""",
    version="1.0.0",
    contact={
        "name": "Proyecto SentinelPredict",
        "email": "sentinelpredict@demo.local"
    }
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["System"], summary="Verificar raíz de la API")
def root():
    return {
        "message": "SentinelPredict backend is running"
    }


@app.get("/health", tags=["System"], summary="Verificar estado del sistema")
def health_check():
    return {
        "status": "ok"
    }


app.include_router(reports.router)
app.include_router(analytics.router)