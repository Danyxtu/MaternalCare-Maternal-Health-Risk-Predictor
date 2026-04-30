import shap
import joblib
import os

# Use absolute paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "model")
model_path = os.path.join(MODEL_DIR, "model.pkl")

# Load model
model = joblib.load(model_path)

# Use TreeExplainer (FAST for RandomForest)
explainer = shap.TreeExplainer(model)

def get_shap_values(X_processed):
    shap_values = explainer.shap_values(X_processed)
    return shap_values