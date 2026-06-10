from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    source = Column(String(100), nullable=True, default="manual")
    area = Column(String(100), nullable=True)
    incident_date = Column(DateTime, nullable=True)
    status = Column(String(50), nullable=False, default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)

    classification = relationship("Classification", back_populates="report", uselist=False, cascade="all, delete-orphan")
    entities = relationship("Entity", back_populates="report", cascade="all, delete-orphan")
    summary = relationship("Summary", back_populates="report", uselist=False, cascade="all, delete-orphan")