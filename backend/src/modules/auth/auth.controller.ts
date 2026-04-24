import type { Request, Response } from "express";

import { AuthService } from "./auth.services.ts";

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({
      message: "User registered successfully",
      data: result,
    });
  } catch (error: any) {
    if (error.message === "USER_ALREADY_EXISTS") {
      return res.status(400).json({ message: "User already exists" });
    }
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json({
      message: "Login successful",
      ...result,
    });
  } catch (error: any) {
    if (error.message === "INVALID_EMAIL_OR_PASSWORD") {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
