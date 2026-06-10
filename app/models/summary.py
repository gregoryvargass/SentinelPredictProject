from sqlalchemy import Column, Integer, Text, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base


class Summary(Base):
    __tablename__ = "summaries"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("reports.id"), nullable=False, unique=True)
    content = Column(Text, nullable=False)
    model_name = Column(String(100), nullable=True, default="mock-summarizer")
    created_at = Column(DateTime, default=datetime.utcnow)

    report = relationship("Report", back_populates="summary")