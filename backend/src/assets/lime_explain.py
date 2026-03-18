# lime_explain.py
import sys, json
import numpy as np
import onnxruntime as rt
from lime import lime_tabular
import os

# --- Load patient data from Express ---
patient_data = np.array(json.loads(sys.argv[1]), dtype=np.float32)

# --- Paths ---
script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, "maternal_care_model.onnx")
training_data_path = os.path.join(script_dir, "training_sample.json")
class_names_path = os.path.join(script_dir, "class_names.json")

# --- Load ONNX model ---
sess = rt.InferenceSession(model_path)

# --- Inspect all inputs and outputs ---
input_names = [inp.name for inp in sess.get_inputs()]
prob_name = sess.get_outputs()[1].name  # probabilities output

# --- Load training sample ---
with open(training_data_path) as f:
    training_data = np.array(json.load(f), dtype=np.float32)

# --- Load class names ---
with open(class_names_path) as f:
    class_names = json.load(f)

# --- Feature names (must match ONNX input names order) ---
feature_names = input_names  # use the model's own input names directly

# --- Custom predict_proba wrapper for LIME ---
def custom_predict_proba(data_array):
    data_array = data_array.astype(np.float32)
    results = []
    
    for row in data_array:
        # Map each feature to its corresponding ONNX input name
        input_feed = {
            name: np.array([[row[i]]], dtype=np.float32)
            for i, name in enumerate(input_names)
        }
        probs = sess.run([prob_name], input_feed)[0]
        
        # Handle dict output [{0: p0, 1: p1, ...}]
        if isinstance(probs[0], dict):
            prob_row = [probs[0][k] for k in sorted(probs[0].keys())]
        else:
            prob_row = probs[0].tolist()
        
        results.append(prob_row)
    
    return np.array(results, dtype=np.float32)

# --- LIME Explainer ---
explainer = lime_tabular.LimeTabularExplainer(
    training_data=training_data,
    feature_names=feature_names,
    class_names=class_names,
    mode='classification'
)

# --- Generate Explanation ---
exp = explainer.explain_instance(
    data_row=patient_data,
    predict_fn=custom_predict_proba,
    top_labels=1
)

# --- Get predicted class ---
actual_probs = custom_predict_proba(patient_data.reshape(1, -1))
actual_class_idx = int(np.argmax(actual_probs))

# --- Build output ---
explained_class_idx = exp.available_labels()[0]
explanation = {
    "predicted_class": class_names[actual_class_idx],
    "probability": float(np.max(actual_probs)),
    "features": [
        {
            "condition": feat,
            "weight": float(weight),
            "impact": "Increased" if weight > 0 else "Decreased"
        }
        for feat, weight in exp.as_list(label=explained_class_idx)
    ]
}

print(json.dumps(explanation))