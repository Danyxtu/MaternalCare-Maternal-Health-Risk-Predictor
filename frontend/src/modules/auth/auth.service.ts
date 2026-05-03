import api from "#api/api.ts";
import { RegisterPayload, LoginPayload } from "./auth.dto";

export const register = async (payload: RegisterPayload) => {
  try {
    await api.post("/auth/register", payload);
  } catch (err: any) {
    throw new Error(err?.message ?? "Registration failed. Please try again.");
  }
};

export const login = async (payload: LoginPayload) => {
  try {
    const response = await api.post("/auth/login", payload);
    return response.data;
  } catch (err: any) {
    throw new Error(
      err?.message ??
        "Login failed. Please check your credentials and try again.",
    );
  }
};
