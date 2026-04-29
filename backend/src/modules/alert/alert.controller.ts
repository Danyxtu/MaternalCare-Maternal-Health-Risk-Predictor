import type { Request, Response } from "express";
import { AlertService } from "./alert.service.ts";

const alertService = new AlertService();

export const getAlerts = async (req: Request, res: Response) => {
  try {
    const alerts = await alertService.getAlerts();
    res.status(200).json({
      message: "Alerts retrieved successfully",
      data: alerts,
    });
  } catch (error: any) {
    console.error("[Alert Controller Error]", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAlertStats = async (req: Request, res: Response) => {
  try {
    const stats = await alertService.getAlertStats();
    res.status(200).json({
      message: "Alert stats retrieved successfully",
      data: stats,
    });
  } catch (error: any) {
    console.error("[Alert Controller Error]", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
