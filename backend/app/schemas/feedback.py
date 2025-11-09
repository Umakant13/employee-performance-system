from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class FeedbackBase(BaseModel):
    employee_id: int
    comments: Optional[str] = None
    rating: float = Field(..., ge=1, le=5)

class FeedbackCreate(FeedbackBase):
    pass

class FeedbackResponse(FeedbackBase):
    id: int
    feedback_date: datetime
    created_by: Optional[int]
    
    class Config:
        from_attributes = True