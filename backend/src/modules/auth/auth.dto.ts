export interface RegisterInput {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  middle_initial: string;
  role: "DOCTOR" | "PATIENT" | "ADMIN";
  id_card_url?: string;
}

export interface RegisterResponse {
  userId: number;
  role: string;
  first_name: string | null;
  last_name: string | null;
  middle_initial: string | null;
  email: string;
  patientId: number | undefined;
  doctorId: number | undefined;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  role: string;
  first_name: string | null;
  last_name: string | null;
  middle_initial: string | null;
  email: string;
  patientId: number | undefined;
  doctorId: number | undefined;
  age?: number;
  contact?: string | null;
}
