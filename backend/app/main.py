from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import init_db
from app.routes import auth, employee, prediction, feedback

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="Employee Performance & Attrition Prediction System",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
@app.on_event("startup")
async def startup_event():
    init_db()
    print("✓ Database initialized")

# Include routers
app.include_router(auth.router)
app.include_router(employee.router)
app.include_router(prediction.router)
app.include_router(feedback.router)

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Employee Performance & Attrition Prediction API",
        "version": "1.0.0",
        "docs": "/docs"
    }

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)