import axios from "axios";
import { generateClinicalInsights } from "@/src/lib/gemini.ts";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:5000";

export const explainModel = async (req: any, res: any) => {
  const data = req.body?.physiological_data;
  
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return res
      .status(400)
      .json({ error: "physiological_data is required" });
  }

  // Handle both array and object input
  const inputData = Array.isArray(data) ? data : Object.values(data);

  try {
    // Call the Flask ML Service
    const response = await axios.post(`${ML_SERVICE_URL}/predict`, {
      input: inputData
    });

    const { prediction, label, probability, top_features } = response.data;

    // Map features for frontend
    const features = top_features.map((f: any) => ({
      condition: f.feature,
      weight: f.impact,
      impact: f.impact > 0 ? "Increased" : "Decreased"
    }));

    // Call Gemini for clinical insights
    const insights = await generateClinicalInsights(
      req.body.physiological_data,
      label,
      features
    );

    return res.json({
      predicted_class: label,
      prediction_value: prediction,
      probability: probability,
      features: features,
      possible_maternal_risks: insights.possible_maternal_risks,
      recommendations: insights.recommendations
    });

  } catch (error: any) {
    console.error("Prediction Error:", error.message);
    
    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({
        error: "ML Service is not running",
        details: "Please start the Flask app in ml-service/src/app.py"
      });
    }

    return res.status(error.response?.status || 500).json({
      error: "ML Service request failed",
      details: error.response?.data?.error || error.message
    });
  }
};
