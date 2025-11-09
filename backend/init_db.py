from app.database import init_db, SessionLocal
from app.models.user import User
from passlib.context import CryptContext

# Initialize password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str):
    """Safely hash passwords, truncate if too long (bcrypt limit 72 bytes)"""
    if len(password.encode('utf-8')) > 72:
        password = password[:72]
    return pwd_context.hash(password)

def create_admin_user():
    """Create default admin user"""
    db = SessionLocal()
    try:
        existing_admin = db.query(User).filter(User.username == "admin").first()

        if not existing_admin:
            admin = User(
                username="admin",
                email="admin@company.com",
                password_hash=get_password_hash("admin123"),
                role="admin"
            )
            db.add(admin)
            db.commit()
            print("✓ Admin user created (username: admin, password: admin123)")
        else:
            print("✓ Admin user already exists")
    finally:
        db.close()

def main():
    print("Initializing database...")
    init_db()
    print("✓ Database tables created")

    print("\nCreating admin user...")
    create_admin_user()

    print("\n✓ Database initialization completed!")

if __name__ == "__main__":
    main()
