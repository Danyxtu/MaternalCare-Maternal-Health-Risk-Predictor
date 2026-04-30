import joblib
import numpy as np
import pandas as pd
import json
import os

# Get the directory of the current script (ml-service/src)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "model")

# Load model + preprocessor using absolute paths
model_path = os.path.join(MODEL_DIR, "model.pkl")
prep_path = os.path.join(MODEL_DIR, "preprocessor.pkl")
feat_path = os.path.join(MODEL_DIR, "feature_names.json")

model = joblib.load(model_path)
preprocessor = joblib.load(prep_path)

# Load feature names to create DataFrame
with open(feat_path) as f:
    feature_names = json.load(f)

def predict(input_data):
    X = np.array(input_data)
    
    # Ensure X is 2D: (n_samples, n_features)
    if X.ndim == 1:
        X = X.reshape(1, -1)
    
    # Convert to DataFrame
    X_df = pd.DataFrame(X, columns=feature_names)
    
    # Apply preprocessing
    X_processed = preprocessor.transform(X_df)
    
    # Predict
    prediction = model.predict(X_processed)
    
    # Probabilities
    try:
        probabilities = model.predict_proba(X_processed)
    except Exception:
        probabilities = None
    
    return prediction, X_processed, probabilities