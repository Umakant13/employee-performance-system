import sys
import subprocess
import os

def run_command(command, description):
    """Run a shell command"""
    print(f"\n{'='*60}")
    print(f"⚙️  {description}")
    print(f"{'='*60}")
    
    result = subprocess.run(command, shell=True)
    
    if result.returncode != 0:
        print(f"❌ Error: {description} failed")
        sys.exit(1)
    else:
        print(f"✓ {description} completed successfully")

def main():
    print("""
    ╔══════════════════════════════════════════════════════════╗
    ║   Employee Performance & Attrition Prediction System     ║
    ║                   Setup Script                           ║
    ╚══════════════════════════════════════════════════════════╝
    """)
    
    # Check if we're in the backend directory
    if not os.path.exists('app'):
        print("❌ Error: Please run this script from the backend directory")
        sys.exit(1)
    
    # Step 1: Generate training data
    run_command(
        "python -m app.ml.generate_data",
        "Generating synthetic employee data"
    )
    
    # Step 2: Train ML models
    run_command(
        "python -m app.ml.train_model",
        "Training ML models"
    )
    
    print(f"\n{'='*60}")
    print("✓ Setup completed successfully!")
    print(f"{'='*60}")
    print("\nNext steps:")
    print("1. Make sure MySQL is running")
    print("2. Update .env file with your database credentials")
    print("3. Run: python -m app.main")
    print("4. Visit http://localhost:8000/docs for API documentation")

if __name__ == "__main__":
    main()