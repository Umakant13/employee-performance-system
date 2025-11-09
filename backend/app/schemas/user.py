from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    role: str = Field(default="employee")

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)
    employee_id: Optional[int] = None
    
    # Employee specific fields (for employee signup)
    name: Optional[str] = None
    department: Optional[str] = None
    age: Optional[int] = None
    experience: Optional[int] = None
    salary: Optional[float] = None

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(UserBase):
    id: int
    employee_id: Optional[int]
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None