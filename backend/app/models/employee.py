from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from sqlalchemy.sql import func
from app.database import Base

class Employee(Base):
    __tablename__ = "employees"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    department = Column(String(50), nullable=False)
    age = Column(Integer, nullable=False)
    experience = Column(Integer, nullable=False)  # in years
    salary = Column(Float, nullable=False)
    performance_score = Column(Float, nullable=True)
    satisfaction_level = Column(Float, nullable=True)  # 0-1
    last_evaluation_score = Column(Float, nullable=True)  # 0-1
    project_count = Column(Integer, default=0)
    work_hours = Column(Integer, default=40)
    attrition_prediction = Column(String(1), default='N')  # Y/N
    attrition_probability = Column(Float, default=0.0)
    performance_prediction = Column(Float, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<Employee {self.name}>"