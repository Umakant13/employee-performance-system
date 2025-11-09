from app.database import SessionLocal
from app.models.employee import Employee
from app.models.user import User
from app.utils.auth import get_password_hash
import random

def add_sample_data():
    db = SessionLocal()
    
    try:
        # Check if data already exists
        existing = db.query(Employee).count()
        if existing > 0:
            print(f"Database already has {existing} employees")
            return
        
        departments = ['IT', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations', 'Support']
        names = [
            'John Smith', 'Jane Doe', 'Mike Johnson', 'Sarah Williams', 
            'Bob Brown', 'Alice Davis', 'Tom Wilson', 'Emma Garcia',
            'Chris Martinez', 'Lisa Anderson', 'David Taylor', 'Mary Thomas'
        ]
        
        print("Adding sample employees...")
        
        for i, name in enumerate(names, 1):
            dept = random.choice(departments)
            employee = Employee(
                name=name,
                email=f"{name.lower().replace(' ', '.')}@company.com",
                department=dept,
                age=random.randint(25, 55),
                experience=random.randint(1, 20),
                salary=random.randint(50000, 120000),
                satisfaction_level=round(random.uniform(0.4, 0.95), 2),
                last_evaluation_score=round(random.uniform(0.5, 0.95), 2),
                project_count=random.randint(1, 6),
                work_hours=random.randint(35, 55),
                is_active=True
            )
            db.add(employee)
            db.flush()
            
            # Create user for this employee
            username = name.lower().replace(' ', '.')
            user = User(
                username=username,
                email=employee.email,
                password_hash=get_password_hash('password123'),
                role='employee',
                employee_id=employee.id,
                is_active=True
            )
            db.add(user)
            print(f"✓ Added {name} (username: {username})")
        
        db.commit()
        print(f"\n✓ Successfully added {len(names)} employees")
        print("Default password for all: password123")
        
    except Exception as e:
        print(f"Error: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    add_sample_data()