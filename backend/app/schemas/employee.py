from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class EmployeeBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    department: str
    age: int = Field(..., ge=18, le=70)
    experience: int = Field(..., ge=0, le=50)
    salary: float = Field(..., gt=0)
    satisfaction_level: Optional[float] = Field(None, ge=0, le=1)
    last_evaluation_score: Optional[float] = Field(None, ge=0, le=1)
    project_count: int = Field(default=0, ge=0)
    work_hours: int = Field(default=40, ge=0, le=80)

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    department: Optional[str] = None
    age: Optional[int] = None
    experience: Optional[int] = None
    salary: Optional[float] = None
    satisfaction_level: Optional[float] = None
    last_evaluation_score: Optional[float] = None
    project_count: Optional[int] = None
    work_hours: Optional[int] = None
    is_active: Optional[bool] = None

class EmployeeResponse(EmployeeBase):
    id: int
    performance_score: Optional[float]
    attrition_prediction: str
    attrition_probability: float
    performance_prediction: Optional[float]
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class PredictionInput(BaseModel):
    employee_id: int

class PredictionResponse(BaseModel):
    employee_id: int
    attrition_prediction: str
    attrition_probability: float
    performance_prediction: float
    risk_level: str  # Low, Medium, High