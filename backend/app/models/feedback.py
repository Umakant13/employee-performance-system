from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class Feedback(Base):
    __tablename__ = "feedback"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    comments = Column(Text, nullable=True)
    rating = Column(Float, nullable=False)  # 1-5
    feedback_date = Column(DateTime(timezone=True), server_default=func.now())
    created_by = Column(Integer, nullable=True)  # Admin user ID
    
    def __repr__(self):
        return f"<Feedback for Employee {self.employee_id}>"