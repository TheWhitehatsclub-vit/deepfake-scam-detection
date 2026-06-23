from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.sql import func
from database import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)

    filename = Column(String)

    extracted_text = Column(Text)

    screenshot_type = Column(String)

    scam_probability = Column(Integer)

    risk_level = Column(String)

    tactics = Column(JSON)

    urls_found = Column(Integer)

    trust_score = Column(Integer)

    explanation = Column(Text)

    recommendations = Column(JSON)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )