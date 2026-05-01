export interface RegisterPayload {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  middle_initial?: string;
  role: "PATIENT" | "DOCTOR";
}

export interface LoginPayload {
  email: string;
  password: string;
}
