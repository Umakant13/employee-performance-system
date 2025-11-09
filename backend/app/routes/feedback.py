from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.feedback import Feedback
from app.models.employee import Employee
from app.models.user import User
from app.schemas.feedback import FeedbackCreate, FeedbackResponse
from app.utils.auth import get_current_user, get_current_admin_user

router = APIRouter(prefix="/feedback", tags=["Feedback"])

@router.post("/", response_model=FeedbackResponse, status_code=status.HTTP_201_CREATED)
async def create_feedback(
    feedback: FeedbackCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Create feedback for an employee (Admin only)"""
    
    # Check if employee exists
    employee = db.query(Employee).filter(Employee.id == feedback.employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    
    db_feedback = Feedback(
        **feedback.dict(),
        created_by=current_user.id
    )
    
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    
    return db_feedback

@router.get("/employee/{employee_id}", response_model=List[FeedbackResponse])
async def get_employee_feedback(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all feedback for an employee"""
    
    # Non-admin can only view their own feedback
    if current_user.role != "admin" and current_user.employee_id != employee_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this feedback"
        )
    
    feedback = db.query(Feedback).filter(
        Feedback.employee_id == employee_id
    ).order_by(Feedback.feedback_date.desc()).all()
    
    return feedback

@router.get("/{feedback_id}", response_model=FeedbackResponse)
async def get_feedback(
    feedback_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get feedback by ID"""
    
    feedback = db.query(Feedback).filter(Feedback.id == feedback_id).first()
    
    if not feedback:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Feedback not found"
        )
    
    return feedback

@router.delete("/{feedback_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_feedback(
    feedback_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Delete feedback (Admin only)"""
    
    feedback = db.query(Feedback).filter(Feedback.id == feedback_id).first()
    
    if not feedback:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Feedback not found"
        )
    
    db.delete(feedback)
    db.commit()
    
    return None