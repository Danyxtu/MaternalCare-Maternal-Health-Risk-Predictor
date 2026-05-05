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

    Patient Physiological Data (Note: BodyTemp is in Fahrenheit):
    ${JSON.stringify(physiologicalData, null, 2)}

    Machine Learning Assessment:
    - Predicted Risk Level: ${riskLevel}
    - Top Contributing Factors: ${JSON.stringify(contributingFactors, null, 2)}

    CRITICAL INSTRUCTION FOR INTERPRETING CONTRIBUTING FACTORS:
    The "impact" (Increased/Decreased) refers to how much a feature contributes to the PREDICTED RISK LEVEL, not whether the physiological value itself is high or low.
    - If the Predicted Risk Level is "Low Risk":
        1. "Increased" impact factors (positive weights) are GOOD; they support the healthy status.
        2. "Decreased" impact factors (negative weights) are areas for improvement; they are pulling the patient away from being Low Risk. Focus your medical recommendations on these negative factors.
        3. Do NOT suggest any maternal risks for Low Risk patients.
    - If the Predicted Risk Level is "High Risk" or "Mid Risk":
        1. "Increased" impact factors (positive weights) are the primary risks causing the elevated classification.
        2. "Decreased" impact factors (negative weights) are mitigating factors.
    
    ALWAYS evaluate the actual physiological value in "Patient Physiological Data" against standard clinical thresholds before determining if it is abnormal.

    Please respond with ONLY a JSON object in the following format:
    {
      "possible_maternal_risks": ["Risk 1", "Risk 2", ...],
      "recommendations": ["Recommendation 1", "Recommendation 2", ...]
    }

    Note: If the Risk Level is "Low Risk", "possible_maternal_risks" should be an empty array [].

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

export async function generateWellnessTips(wellnessData: any): Promise<string[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

  const prompt = `
    You are a supportive maternal wellness coach. Based on the following daily check-in data from a pregnant patient, provide 3-4 concise, friendly, and actionable wellness tips.
    
    Data:
    ${JSON.stringify(wellnessData, null, 2)}

    Focus on:
    - Encouragement
    - Practical lifestyle improvements (diet, hydration, sleep, stress)
    - Always include a mandatory clinical disclaimer.

    Respond with ONLY a JSON array of strings.
    Example: ["Tip 1", "Tip 2", "Tip 3"]
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const tips = JSON.parse(cleanedText);
    
    // Add mandatory disclaimer
    tips.push("Consult your doctor or healthcare provider for any medical concerns or before making significant lifestyle changes.");
    
    return tips;
  } catch (error) {
    console.error("Gemini Wellness Tips Error:", error);
    return [
      "Keep staying hydrated and get plenty of rest.",
      "A balanced diet is key to a healthy pregnancy.",
      "Consult your doctor for personalized medical advice."
    ];
  }
}
