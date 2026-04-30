from flask import Flask, request, jsonify
from predict import predict, preprocessor
from explain import get_shap_values
import json
import os
import numpy as np

app = Flask(__name__)

# Use absolute paths for model assets
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "model")

# Load feature names
with open(os.path.join(MODEL_DIR, "feature_names.json")) as f:
    feature_names = json.load(f)

# Load label mapping
try:
    with open(os.path.join(MODEL_DIR, "label_mapping.json")) as f:
        label_mapping = json.load(f)
except Exception:
    label_mapping = {}

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

@app.route("/predict", methods=["POST"])
def predict_route():
    try:
        data = request.json
        if not data or "input" not in data:
            return jsonify({"error": "Missing 'input' in request body"}), 400
            
        input_data = data["input"]

        prediction, X_processed, probabilities = predict(input_data)
        shap_values = get_shap_values(X_processed)

        # Ensure we get a single value from the prediction
        if hasattr(prediction, "flatten"):
            raw_pred = prediction.flatten()[0]
        else:
            raw_pred = prediction[0]
        
        # We need the numeric index for SHAP values
        if isinstance(raw_pred, (str, np.str_)):
            raw_pred = str(raw_pred) 
            pred_class_idx = None
            for k, v in label_mapping.items():
                if v.lower() == raw_pred.lower():
                    pred_class_idx = int(k)
                    break
            
            if pred_class_idx is None:
                pred_class_idx = 0 
                label = raw_pred
            else:
                label = label_mapping.get(str(pred_class_idx), raw_pred)
        else:
            pred_class_idx = int(raw_pred)
            label = label_mapping.get(str(pred_class_idx), f"Class {pred_class_idx}")

        # Get probability
        if probabilities is not None:
            prob = float(np.max(probabilities))
        else:
            prob = 1.0 # Fallback

        # Get feature names after preprocessing if possible
        try:
            processed_feature_names = preprocessor.get_feature_names_out()
        except Exception:
            processed_feature_names = feature_names

        # Determine which SHAP array to use (the impact per feature for the predicted class)
        num_features = len(processed_feature_names)
        num_classes = len(label_mapping)
        
        try:
            if isinstance(shap_values, list):
                # Multiclass: list of arrays [class0, class1, ...]
                idx = min(pred_class_idx, len(shap_values) - 1)
                shap_for_class = shap_values[idx]
                if len(shap_for_class.shape) == 2:
                    shap_for_class = shap_for_class[0]
            
            elif isinstance(shap_values, np.ndarray):
                shape = shap_values.shape
                if len(shape) == 3:
                    # Disambiguate (samples, features, classes) vs (classes, samples, features)
                    if shape[1] == num_features:
                        # (samples, features, classes)
                        idx = min(pred_class_idx, shape[2] - 1)
                        shap_for_class = shap_values[0, :, idx]
                    elif shape[2] == num_features:
                        # (classes, samples, features)
                        idx = min(pred_class_idx, shape[0] - 1)
                        shap_for_class = shap_values[idx, 0, :]
                    else:
                        shap_for_class = shap_values.flatten()[:num_features]
                elif len(shape) == 2:
                    shap_for_class = shap_values[0]
                else:
                    shap_for_class = shap_values.flatten()
            else:
                shap_for_class = np.array(shap_values)[0]
        except Exception:
            shap_for_class = np.zeros(num_features)

        # Ensure shap_for_class is 1D
        if hasattr(shap_for_class, "flatten"):
            shap_for_class = shap_for_class.flatten()

        # Combine feature + shap value
        explanation = []
        for i in range(len(shap_for_class)):
            feat_name = processed_feature_names[i] if i < len(processed_feature_names) else f"feature_{i}"
            val = shap_for_class[i]
            if hasattr(val, "item"):
                val = val.item()
            
            explanation.append({
                "feature": str(feat_name),
                "impact": float(val)
            })

        # Sort by importance
        explanation = sorted(explanation, key=lambda x: abs(x["impact"]), reverse=True)

        return jsonify({
            "prediction": pred_class_idx if not isinstance(raw_pred, str) else raw_pred,
            "label": label,
            "probability": prob,
            "top_features": explanation[:5]
        })

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
