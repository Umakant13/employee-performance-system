from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List
from app.database import get_db
from app.models.employee import Employee
from app.models.user import User
from app.schemas.employee import (
    EmployeeCreate,
    EmployeeUpdate,
    EmployeeResponse
)
from app.utils.auth import get_current_user, get_current_admin_user, get_password_hash
from app.utils.dependencies import PaginationParams, FilterParams

router = APIRouter(prefix="/employees", tags=["Employees"])

@router.post("/", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
async def create_employee(
    employee: EmployeeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Create a new employee (Admin only)"""
    
    # Check if email exists
    existing = db.query(Employee).filter(Employee.email == employee.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create employee
    db_employee = Employee(**employee.dict())
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    
    # Create user account for this employee
    try:
        # Generate username from email
        username = employee.email.split('@')[0]
        
        # Check if username exists, if so add employee id
        existing_user = db.query(User).filter(User.username == username).first()
        if existing_user:
            username = f"{username}{db_employee.id}"
        
        # Create user with default password
        default_password = "password123"  # Employee should change this
        
        new_user = User(
            username=username,
            email=employee.email,
            password_hash=get_password_hash(default_password),
            role="employee",
            employee_id=db_employee.id,
            is_active=True
        )
        
        db.add(new_user)
        db.commit()
        
        print(f"✓ Created user account: {username} (password: {default_password})")
        
    except Exception as e:
        print(f"Warning: Could not create user account: {str(e)}")
        # Don't fail the employee creation if user creation fails
    
    return db_employee

@router.get("/", response_model=List[EmployeeResponse])
async def get_employees(
    pagination: PaginationParams = Depends(),
    filters: FilterParams = Depends(),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all employees with pagination and filters"""
    
    query = db.query(Employee)
    
    # Apply filters
    if filters.department:
        query = query.filter(Employee.department == filters.department)
    
    if filters.is_active is not None:
        query = query.filter(Employee.is_active == filters.is_active)
    
    if filters.search:
        query = query.filter(
            or_(
                Employee.name.ilike(f"%{filters.search}%"),
                Employee.email.ilike(f"%{filters.search}%")
            )
        )
    
    # Pagination
    employees = query.offset(pagination.skip).limit(pagination.limit).all()
    
    return employees

@router.get("/{employee_id}", response_model=EmployeeResponse)
async def get_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get employee by ID"""
    
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    
    # Non-admin can only view their own data
    if current_user.role != "admin" and current_user.employee_id != employee_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this employee"
        )
    
    return employee

@router.put("/{employee_id}", response_model=EmployeeResponse)
async def update_employee(
    employee_id: int,
    employee_update: EmployeeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Update employee (Admin only)"""
    
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    
    # Update fields
    update_data = employee_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(employee, field, value)
    
    db.commit()
    db.refresh(employee)
    
    return employee

@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Delete employee (Admin only)"""
    
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    
    # Also delete associated user account
    user = db.query(User).filter(User.employee_id == employee_id).first()
    if user:
        db.delete(user)
        print(f"✓ Deleted associated user account: {user.username}")
    
    db.delete(employee)
    db.commit()
    
    return None

@router.get("/stats/dashboard")
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get dashboard statistics"""
    
    total_employees = db.query(Employee).filter(Employee.is_active == True).count()
    
    high_risk = db.query(Employee).filter(
        Employee.attrition_probability > 0.6,
        Employee.is_active == True
    ).count()
    
    medium_risk = db.query(Employee).filter(
        Employee.attrition_probability.between(0.3, 0.6),
        Employee.is_active == True
    ).count()
    
    low_risk = db.query(Employee).filter(
        Employee.attrition_probability < 0.3,
        Employee.is_active == True
    ).count()
    
    # Average metrics
    from sqlalchemy import func
    avg_satisfaction = db.query(func.avg(Employee.satisfaction_level)).filter(
        Employee.is_active == True
    ).scalar() or 0
    
    avg_performance = db.query(func.avg(Employee.performance_score)).filter(
        Employee.is_active == True
    ).scalar() or 0
    
    # Department-wise count
    dept_stats = db.query(
        Employee.department,
        func.count(Employee.id).label('count')
    ).filter(
        Employee.is_active == True
    ).group_by(Employee.department).all()
    
    return {
        "total_employees": total_employees,
        "attrition_risk": {
            "high": high_risk,
            "medium": medium_risk,
            "low": low_risk
        },
        "averages": {
            "satisfaction": round(avg_satisfaction, 2),
            "performance": round(avg_performance, 2)
        },
        "department_distribution": [
            {"department": dept, "count": count}
            for dept, count in dept_stats
        ]
    }