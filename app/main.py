import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import reports, analytics
from app.core.database import Base, engine
import app.models

Base.metadata.create_all(bind=engine)

frontend_origins_env = os.getenv("FRONTEND_ORIGINS", "")
frontend_origins = [
    origin.strip()
    for origin in frontend_origins_env.split(",")
    if origin.strip()
]

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    *frontend_origins,
]

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
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["System"], summary="Verificar raíz de la API")
def root():
    return {"message": "SentinelPredict backend is running"}

@app.get("/health", tags=["System"], summary="Verificar estado del sistema")
def health_check():
    return {"status": "ok"}

app.include_router(reports.router)
app.include_router(analytics.router)