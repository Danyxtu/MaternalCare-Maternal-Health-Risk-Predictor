import type { Request, Response } from "express";
import { WellnessService } from "./wellness.service.ts";

const wellnessService = new WellnessService();

export const createCheckIn = async (req: Request, res: Response) => {
  try {
    const patientId = (req.user as any).patientId;
    if (!patientId) {
      return res.status(403).json({ message: "Patient record not found" });
    }

    const result = await wellnessService.createCheckIn(patientId, req.body);
    res.status(201).json({
      message: "Wellness check-in successful",
      data: result,
    });
  } catch (error: any) {
    console.error("[Wellness Controller Error]", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getWellnessHistory = async (req: Request, res: Response) => {
  try {
    const patientId = (req.user as any).patientId;
    if (!patientId) {
      return res.status(403).json({ message: "Patient record not found" });
    }

    const history = await wellnessService.getHistory(patientId);
    res.status(200).json({
      message: "Wellness history retrieved successfully",
      data: history,
    });
  } catch (error: any) {
    console.error("[Wellness Controller Error]", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
