from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base


class Classification(Base):
    __tablename__ = "classifications"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("reports.id"), nullable=False, unique=True)
    label = Column(String(100), nullable=False)
    confidence = Column(Float, nullable=False, default=0.0)
    model_name = Column(String(100), nullable=True, default="mock-classifier")
    created_at = Column(DateTime, default=datetime.utcnow)

    report = relationship("Report", back_populates="classification")