import type { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        id: string;
        // Add any other fields you put in your JWT payload
      };
    }
  }
}
