from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.employee import Employee
from app.models.user import User
from app.schemas.employee import PredictionInput, PredictionResponse
from app.utils.auth import get_current_user
from app.ml.predict import get_predictor

router = APIRouter(prefix="/predict", tags=["Predictions"])

@router.post("/employee/{employee_id}", response_model=PredictionResponse)
async def predict_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Predict attrition and performance for an employee"""
    
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    
    # Prepare employee data
    employee_data = {
        'age': employee.age,
        'experience': employee.experience,
        'salary': employee.salary,
        'department': employee.department,
        'satisfaction_level': employee.satisfaction_level or 0.7,
        'last_evaluation_score': employee.last_evaluation_score or 0.7,
        'project_count': employee.project_count,
        'work_hours': employee.work_hours
    }
    
    # Get predictor and make predictions
    predictor = get_predictor()
    predictions = predictor.predict_all(employee_data)
    
    # Update employee record
    employee.attrition_prediction = predictions['attrition_prediction']
    employee.attrition_probability = predictions['attrition_probability']
    employee.performance_prediction = predictions['performance_prediction']
    employee.performance_score = predictions['performance_prediction']
    
    db.commit()
    
    return {
        "employee_id": employee_id,
        "attrition_prediction": predictions['attrition_prediction'],
        "attrition_probability": predictions['attrition_probability'],
        "performance_prediction": predictions['performance_prediction'],
        "risk_level": predictions['risk_level']
    }

@router.post("/batch", status_code=status.HTTP_200_OK)
async def predict_batch(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Run predictions for all active employees"""
    
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can run batch predictions"
        )
    
    employees = db.query(Employee).filter(Employee.is_active == True).all()
    predictor = get_predictor()
    
    updated_count = 0
    
    for employee in employees:
        employee_data = {
            'age': employee.age,
            'experience': employee.experience,
            'salary': employee.salary,
            'department': employee.department,
            'satisfaction_level': employee.satisfaction_level or 0.7,
            'last_evaluation_score': employee.last_evaluation_score or 0.7,
            'project_count': employee.project_count,
            'work_hours': employee.work_hours
        }
        
        predictions = predictor.predict_all(employee_data)
        
        employee.attrition_prediction = predictions['attrition_prediction']
        employee.attrition_probability = predictions['attrition_probability']
        employee.performance_prediction = predictions['performance_prediction']
        employee.performance_score = predictions['performance_prediction']
        
        updated_count += 1
    
    db.commit()
    
    return {
        "message": f"Successfully updated predictions for {updated_count} employees",
        "updated_count": updated_count
    }