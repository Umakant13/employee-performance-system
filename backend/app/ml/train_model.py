import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import accuracy_score, classification_report, mean_squared_error, r2_score
import joblib
import os

def train_models():
    """Train attrition and performance prediction models"""
    
    # Load data
    df = pd.read_csv('app/ml/employee_data.csv')
    
    print("Dataset shape:", df.shape)
    print("\nColumns:", df.columns.tolist())
    
    # Prepare features
    feature_columns = [
        'age', 'experience', 'salary', 'satisfaction_level',
        'last_evaluation_score', 'project_count', 'work_hours'
    ]
    
    # Encode department
    le_dept = LabelEncoder()
    df['department_encoded'] = le_dept.fit_transform(df['department'])
    feature_columns.append('department_encoded')
    
    X = df[feature_columns]
    
    # ========== ATTRITION MODEL ==========
    print("\n" + "="*50)
    print("Training Attrition Prediction Model")
    print("="*50)
    
    y_attrition = (df['attrition'] == 'Y').astype(int)
    
    X_train_attr, X_test_attr, y_train_attr, y_test_attr = train_test_split(
        X, y_attrition, test_size=0.2, random_state=42, stratify=y_attrition
    )
    
    # Scale features
    scaler_attr = StandardScaler()
    X_train_attr_scaled = scaler_attr.fit_transform(X_train_attr)
    X_test_attr_scaled = scaler_attr.transform(X_test_attr)
    
    # Train Random Forest Classifier
    attrition_model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )
    
    attrition_model.fit(X_train_attr_scaled, y_train_attr)
    
    # Evaluate
    y_pred_attr = attrition_model.predict(X_test_attr_scaled)
    accuracy = accuracy_score(y_test_attr, y_pred_attr)
    
    print(f"\nAttrition Model Accuracy: {accuracy:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test_attr, y_pred_attr, 
                                target_names=['Will Stay', 'Will Leave']))
    
    # Feature importance
    feature_importance_attr = pd.DataFrame({
        'feature': feature_columns,
        'importance': attrition_model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\nTop 5 Important Features for Attrition:")
    print(feature_importance_attr.head())
    
    # Save attrition model and scaler
    os.makedirs('app/ml/models', exist_ok=True)
    joblib.dump(attrition_model, 'app/ml/models/attrition_model.pkl')
    joblib.dump(scaler_attr, 'app/ml/models/attrition_scaler.pkl')
    joblib.dump(le_dept, 'app/ml/models/label_encoder.pkl')
    
    print("\n✓ Attrition model saved")
    
    # ========== PERFORMANCE MODEL ==========
    print("\n" + "="*50)
    print("Training Performance Prediction Model")
    print("="*50)
    
    y_performance = df['performance_score']
    
    X_train_perf, X_test_perf, y_train_perf, y_test_perf = train_test_split(
        X, y_performance, test_size=0.2, random_state=42
    )
    
    # Scale features
    scaler_perf = StandardScaler()
    X_train_perf_scaled = scaler_perf.fit_transform(X_train_perf)
    X_test_perf_scaled = scaler_perf.transform(X_test_perf)
    
    # Train Gradient Boosting Regressor
    performance_model = GradientBoostingRegressor(
        n_estimators=100,
        max_depth=5,
        learning_rate=0.1,
        random_state=42
    )
    
    performance_model.fit(X_train_perf_scaled, y_train_perf)
    
    # Evaluate
    y_pred_perf = performance_model.predict(X_test_perf_scaled)
    mse = mean_squared_error(y_test_perf, y_pred_perf)
    rmse = np.sqrt(mse)
    r2 = r2_score(y_test_perf, y_pred_perf)
    
    print(f"\nPerformance Model RMSE: {rmse:.4f}")
    print(f"Performance Model R² Score: {r2:.4f}")
    
    # Feature importance
    feature_importance_perf = pd.DataFrame({
        'feature': feature_columns,
        'importance': performance_model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\nTop 5 Important Features for Performance:")
    print(feature_importance_perf.head())
    
    # Save performance model and scaler
    joblib.dump(performance_model, 'app/ml/models/performance_model.pkl')
    joblib.dump(scaler_perf, 'app/ml/models/performance_scaler.pkl')
    
    print("\n✓ Performance model saved")
    
    print("\n" + "="*50)
    print("Model training completed successfully!")
    print("="*50)
    
    return {
        'attrition_accuracy': accuracy,
        'performance_rmse': rmse,
        'performance_r2': r2
    }

if __name__ == "__main__":
    metrics = train_models()
    print("\nFinal Metrics:")
    print(f"Attrition Accuracy: {metrics['attrition_accuracy']:.4f}")
    print(f"Performance RMSE: {metrics['performance_rmse']:.4f}")
    print(f"Performance R²: {metrics['performance_r2']:.4f}")