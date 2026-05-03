export interface CreateWellnessCheckDto {
  sleep_hours: number;
  water_intake?: number;
  diet_quality?: string;
  stress_level?: string;
  supplements_taken?: boolean;
  mood?: string;
}
