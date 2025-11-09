import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

def generate_employee_data(n_samples=500):
    """Generate synthetic employee data for training with more extreme cases"""
    
    np.random.seed(42)
    random.seed(42)
    
    departments = ['IT', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations', 'Support']
    names_first = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 
                   'Lisa', 'William', 'Mary', 'James', 'Patricia', 'Richard', 'Jennifer']
    names_last = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
                  'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez']
    
    data = []
    
    # Create specific distributions for different risk levels
    high_risk_count = int(n_samples * 0.25)  # 25% high risk
    medium_risk_count = int(n_samples * 0.35)  # 35% medium risk
    low_risk_count = n_samples - high_risk_count - medium_risk_count  # 40% low risk
    
    for i in range(n_samples):
        name = f"{random.choice(names_first)} {random.choice(names_last)}"
        email = f"{name.lower().replace(' ', '.')}@company.com"
        department = random.choice(departments)
        age = np.random.randint(22, 65)
        experience = min(np.random.randint(0, age - 21), 40)
        
        # Determine risk category for this employee
        if i < high_risk_count:
            risk_category = 'high'
        elif i < high_risk_count + medium_risk_count:
            risk_category = 'medium'
        else:
            risk_category = 'low'
        
        # Generate data based on risk category
        if risk_category == 'high':
            # HIGH RISK: Very low satisfaction, overworked, poor evaluation
            satisfaction_level = np.random.uniform(0.15, 0.40)  # Very low
            last_evaluation = np.random.uniform(0.30, 0.65)  # Poor to mediocre
            project_count = np.random.choice([1, 8, 9, 10])  # Too few or too many
            work_hours = np.random.uniform(60, 75)  # Overworked
            base_salary = 40000 + (experience * 1500)  # Underpaid
            
        elif risk_category == 'medium':
            # MEDIUM RISK: Moderate satisfaction, some issues
            satisfaction_level = np.random.uniform(0.40, 0.65)  # Moderate
            last_evaluation = np.random.uniform(0.55, 0.75)  # Average
            project_count = np.random.choice([2, 5, 6])  # Acceptable
            work_hours = np.random.uniform(48, 58)  # Somewhat overworked
            base_salary = 40000 + (experience * 2000)  # Slightly underpaid
            
        else:  # low risk
            # LOW RISK: High satisfaction, balanced workload
            satisfaction_level = np.random.uniform(0.70, 0.95)  # High
            last_evaluation = np.random.uniform(0.75, 0.95)  # Good to excellent
            project_count = np.random.choice([3, 4])  # Balanced
            work_hours = np.random.uniform(38, 48)  # Normal
            base_salary = 40000 + (experience * 2800)  # Well paid
        
        # Department multiplier
        dept_multiplier = {
            'IT': 1.3, 'Sales': 1.2, 'Finance': 1.25,
            'Marketing': 1.1, 'HR': 1.0, 'Operations': 1.05, 'Support': 0.95
        }
        salary = base_salary * dept_multiplier[department] * np.random.uniform(0.95, 1.05)
        
        # Calculate performance score
        performance_score = (
            last_evaluation * 40 +
            min(project_count / 5, 1) * 30 +
            satisfaction_level * 20 +
            (1 - abs(work_hours - 45) / 45) * 10
        )
        
        # Calculate attrition score based on multiple factors
        attrition_score = 0
        
        # Satisfaction is the biggest factor
        if satisfaction_level < 0.3:
            attrition_score += 50
        elif satisfaction_level < 0.5:
            attrition_score += 30
        elif satisfaction_level < 0.7:
            attrition_score += 10
        
        # Work hours
        if work_hours > 60:
            attrition_score += 30
        elif work_hours > 52:
            attrition_score += 15
        elif work_hours < 38:
            attrition_score += 5
        
        # Projects
        if project_count > 7:
            attrition_score += 20
        elif project_count < 2:
            attrition_score += 15
        
        # Evaluation
        if last_evaluation < 0.5:
            attrition_score += 15
        
        # Salary vs experience
        expected_salary = 40000 + (experience * 2500) * dept_multiplier[department]
        if salary < expected_salary * 0.80:
            attrition_score += 20
        elif salary < expected_salary * 0.90:
            attrition_score += 10
        
        # Add randomness
        attrition_score += np.random.randint(-8, 8)
        
        # Ensure high risk employees have high scores
        if risk_category == 'high':
            attrition_score = max(attrition_score, 65)
        elif risk_category == 'medium':
            attrition_score = min(max(attrition_score, 35), 65)
        else:
            attrition_score = min(attrition_score, 35)
        
        # Convert to probability
        attrition_probability = min(max(attrition_score / 100, 0), 0.99)
        
        # Binary attrition
        attrition = 'Y' if attrition_probability > 0.5 else 'N'
        
        data.append({
            'name': name,
            'email': email,
            'department': department,
            'age': int(age),
            'experience': int(experience),
            'salary': round(salary, 2),
            'satisfaction_level': round(satisfaction_level, 3),
            'last_evaluation_score': round(last_evaluation, 3),
            'project_count': int(project_count),
            'work_hours': int(work_hours),
            'performance_score': round(performance_score, 2),
            'attrition': attrition,
            'attrition_probability': round(attrition_probability, 3)
        })
    
    df = pd.DataFrame(data)
    return df

if __name__ == "__main__":
    # Generate data
    df = generate_employee_data(500)
    
    # Save to CSV
    df.to_csv('app/ml/employee_data.csv', index=False)
    print(f"Generated {len(df)} employee records")
    print(f"\nAttrition distribution:")
    print(df['attrition'].value_counts())
    
    # Show risk distribution
    print(f"\nRisk distribution:")
    print(f"High risk (>60%): {len(df[df['attrition_probability'] > 0.6])}")
    print(f"Medium risk (30-60%): {len(df[(df['attrition_probability'] > 0.3) & (df['attrition_probability'] <= 0.6)])}")
    print(f"Low risk (<30%): {len(df[df['attrition_probability'] <= 0.3])}")
    
    print(f"\nDepartment distribution:")
    print(df['department'].value_counts())
    print(f"\nData saved to app/ml/employee_data.csv")