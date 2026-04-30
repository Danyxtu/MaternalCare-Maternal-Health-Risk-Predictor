export interface CreateAssessmentDto {
  patientId?: number;
  patientName?: string; // Format: "First Last" or "First M. Last"
  patientAge?: number;
  physiological_data: {
    Age: number;
    SystolicBP: number;
    DiastolicBP: number;
    BS: number;
    BodyTemp: number;
    HeartRate: number;
    sleep_hours: number;
    hemoglobin_g_dL: number;
    iron_supplement: number;
    folic_supplement: number;
    diet_adherence: number;
  };
  predicted_class: string;
  probability: number;
  features: any; // LIME/SHAP features
  possible_maternal_risks?: string[];
  recommendations?: string[];
  notes?: string;
}
