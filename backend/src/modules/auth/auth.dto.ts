export interface RegisterInput {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  middle_initial: string;
  role: "DOCTOR" | "PATIENT";
}

export interface RegisterResponse {
  userId: number;
  role: "DOCTOR" | "PATIENT";
  first_name: string | null;
  last_name: string | null;
  middle_initial: string | null;
  email: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  role: "DOCTOR" | "PATIENT";
  first_name: string | null;
  last_name: string | null;
  middle_initial: string | null;
  email: string;
}
