import sys
import json
import joblib
import numpy as np

def predict_maintenance(mileage, engine_temp, fuel_eff, error_codes):
    # Load the trained model
    model = joblib.load('maintenance_predictor_model.pkl')
    
    # Prepare input data
    input_data = np.array([[mileage, engine_temp, fuel_eff, error_codes]])
    
    # Get prediction and probability
    prediction = model.predict(input_data)[0]
    probability = model.predict_proba(input_data)[0][1]  # Probability of maintenance needed
    
    # Generate recommendations based on input factors
    recommendations = []
    if mileage > 100000:
        recommendations.append("Schedule regular maintenance due to high mileage")
    if engine_temp > 100:
        recommendations.append("Check engine cooling system")
    if fuel_eff < 10:
        recommendations.append("Consider fuel system inspection")
    if error_codes > 2:
        recommendations.append("Address multiple error codes")
    
    return {
        'maintenance_needed': bool(prediction),
        'confidence': float(probability),
        'recommendations': recommendations
    }

if __name__ == "__main__":
    if len(sys.argv) != 5:
        print(json.dumps({
            'error': 'Invalid number of arguments'
        }))
        sys.exit(1)
    
    try:
        mileage = float(sys.argv[1])
        engine_temp = float(sys.argv[2])
        fuel_eff = float(sys.argv[3])
        error_codes = int(sys.argv[4])
        
        result = predict_maintenance(mileage, engine_temp, fuel_eff, error_codes)
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({
            'error': str(e)
        }))
        sys.exit(1) 