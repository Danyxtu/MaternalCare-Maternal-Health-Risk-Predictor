import type { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        id: number;
        role: string;
        patientId: number | undefined;
        doctorId: number | undefined;
      };
    }
  }
}
