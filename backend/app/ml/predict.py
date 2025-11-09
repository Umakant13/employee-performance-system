import joblib
import numpy as np
import pandas as pd
from typing import Dict, Tuple
import os

class MLPredictor:
    def __init__(self):
        model_dir = 'app/ml/models'
        
        # Load models
        self.attrition_model = joblib.load(f'{model_dir}/attrition_model.pkl')
        self.attrition_scaler = joblib.load(f'{model_dir}/attrition_scaler.pkl')
        self.performance_model = joblib.load(f'{model_dir}/performance_model.pkl')
        self.performance_scaler = joblib.load(f'{model_dir}/performance_scaler.pkl')
        self.label_encoder = joblib.load(f'{model_dir}/label_encoder.pkl')
        
    def prepare_features(self, employee_data: Dict) -> np.ndarray:
        """Prepare features from employee data"""
        
        # Encode department
        dept_encoded = self.label_encoder.transform([employee_data['department']])[0]
        
        features = np.array([[
            employee_data['age'],
            employee_data['experience'],
            employee_data['salary'],
            employee_data.get('satisfaction_level', 0.7),
            employee_data.get('last_evaluation_score', 0.7),
            employee_data.get('project_count', 3),
            employee_data.get('work_hours', 40),
            dept_encoded
        ]])
        
        return features
    
    def predict_attrition(self, employee_data: Dict) -> Tuple[str, float]:
        """Predict if employee will leave"""
        
        features = self.prepare_features(employee_data)
        features_scaled = self.attrition_scaler.transform(features)
        
        # Get probability
        probability = self.attrition_model.predict_proba(features_scaled)[0][1]
        
        # Get prediction
        prediction = 'Y' if probability > 0.5 else 'N'
        
        return prediction, float(probability)
    
    def predict_performance(self, employee_data: Dict) -> float:
        """Predict employee performance score"""
        
        features = self.prepare_features(employee_data)
        features_scaled = self.performance_scaler.transform(features)
        
        # Get prediction
        performance = self.performance_model.predict(features_scaled)[0]
        
        # Ensure within bounds
        performance = max(0, min(100, performance))
        
        return float(performance)
    
    def get_risk_level(self, probability: float) -> str:
        """Determine risk level based on attrition probability"""
        
        if probability < 0.3:
            return "Low"
        elif probability < 0.6:
            return "Medium"
        else:
            return "High"
    
    def predict_all(self, employee_data: Dict) -> Dict:
        """Get all predictions for an employee"""
        
        attrition_pred, attrition_prob = self.predict_attrition(employee_data)
        performance_pred = self.predict_performance(employee_data)
        risk_level = self.get_risk_level(attrition_prob)
        
        return {
            'attrition_prediction': attrition_pred,
            'attrition_probability': attrition_prob,
            'performance_prediction': performance_pred,
            'risk_level': risk_level
        }

# Singleton instance
_predictor = None

def get_predictor() -> MLPredictor:
    """Get or create predictor instance"""
    global _predictor
    if _predictor is None:
        _predictor = MLPredictor()
    return _predictor