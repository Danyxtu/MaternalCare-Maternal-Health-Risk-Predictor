import type { Request, Response } from "express";

import { AuthService } from "./auth.service.ts";

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
    if (error.message === "DOCTOR_NOT_APPROVED") {
      return res.status(403).json({ message: "Doctor account is pending approval" });
    }
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email, method } = req.body;
    await authService.forgotPassword(email, method);
    res.status(200).json({ message: "Reset credential sent successfully" });
  } catch (error: any) {
    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "Email does not exist in our system." });
    }
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    await authService.resetPassword(req.body);
    res.status(200).json({ message: "Password reset successful" });
  } catch (error: any) {
    const status = [
      "INVALID_OR_EXPIRED_RESET_REQUEST",
      "INVALID_RESET_TOKEN",
      "INVALID_RESET_OTP",
      "RESET_CREDENTIAL_REQUIRED",
    ].includes(error.message)
      ? 400
      : 500;
    res.status(status).json({ message: error.message });
  }
};
