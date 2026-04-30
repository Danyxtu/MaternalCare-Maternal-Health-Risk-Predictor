import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface ClinicalInsights {
  possible_maternal_risks: string[];
  recommendations: string[];
}

export async function generateClinicalInsights(
  physiologicalData: any,
  riskLevel: string,
  contributingFactors: any[]
): Promise<ClinicalInsights> {
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

  const prompt = `
    You are a medical assistant specializing in maternal health. 
    Based on the following patient data and a machine learning risk assessment, provide a list of possible maternal risks and medical recommendations.

    Patient Physiological Data:
    ${JSON.stringify(physiologicalData, null, 2)}

    Machine Learning Assessment:
    - Predicted Risk Level: ${riskLevel}
    - Top Contributing Factors: ${JSON.stringify(contributingFactors, null, 2)}

    CRITICAL INSTRUCTION FOR INTERPRETING CONTRIBUTING FACTORS:
    The "impact" (Increased/Decreased) refers to how much a feature contributes to the PREDICTED RISK LEVEL, not whether the physiological value itself is high or low.
    - If the Predicted Risk Level is "Low Risk", an "Increased" impact means the value of this feature strongly supports the patient being HEALTHY (e.g., a normal blood sugar level contributing to a Low Risk prediction). Do NOT interpret it as an elevated or dangerous level.
    - If the Predicted Risk Level is "High Risk" or "Mid Risk", an "Increased" impact means the feature strongly supports the patient being at RISK (e.g., elevated blood pressure causing the risk).
    ALWAYS evaluate the actual physiological value in "Patient Physiological Data" against standard clinical thresholds before determining if it is abnormal.

    Please respond with ONLY a JSON object in the following format:
    {
      "possible_maternal_risks": ["Risk 1", "Risk 2", ...],
      "recommendations": ["Recommendation 1", "Recommendation 2", ...]
    }

    Ensure the risks and recommendations are clinically relevant to the provided data.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response in case Gemini adds markdown code blocks
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return JSON.parse(cleanedText) as ClinicalInsights;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      possible_maternal_risks: ["Unable to generate risks at this time."],
      recommendations: ["Consult with a healthcare professional for clinical advice."]
    };
  }
}
