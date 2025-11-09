from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.employee import Employee
from app.schemas.user import UserCreate, UserLogin, Token, UserResponse
from app.utils.auth import (
    verify_password,
    get_password_hash,
    create_access_token
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    
    # Check if username exists
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Check if email exists
    existing_email = db.query(User).filter(User.email == user.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    employee_id = None
    
    # If role is employee, create employee record first
    if user.role == "employee":
        # Check if employee data is provided
        if not hasattr(user, 'name') or not user.name:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Employee information required for employee signup"
            )
        
        # Create employee record
        employee = Employee(
            name=user.name,
            email=user.email,
            department=user.department,
            age=user.age,
            experience=user.experience,
            salary=user.salary,
            satisfaction_level=0.7,
            last_evaluation_score=0.7,
            project_count=0,
            work_hours=40,
            is_active=True
        )
        
        db.add(employee)
        db.flush()  # Get the employee ID without committing
        employee_id = employee.id
    
    # Create user
    db_user = User(
        username=user.username,
        email=user.email,
        password_hash=get_password_hash(user.password),
        role=user.role,
        employee_id=employee_id,
        is_active=True
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """Login and get access token"""
    
    user = db.query(User).filter(User.username == user_credentials.username).first()
    
    if not user or not verify_password(user_credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": user.username, "role": user.role}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }