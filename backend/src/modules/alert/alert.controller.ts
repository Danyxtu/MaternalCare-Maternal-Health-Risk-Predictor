import type { Request, Response } from "express";
import { AlertService } from "./alert.service.ts";
import { prisma } from "@/src/lib/prisma.ts";

const alertService = new AlertService();

export const getAlerts = async (req: Request, res: Response) => {
  try {
    const userId = Number((req.user as any).id);
    const doctor = await prisma.doctor.findUnique({ where: { userId } });
    
    if (!doctor) {
      return res.status(403).json({ message: "Only doctors can view alerts" });
    }

    const alerts = await alertService.getAlerts(doctor.id);
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
    const userId = Number((req.user as any).id);
    const doctor = await prisma.doctor.findUnique({ where: { userId } });
    
    if (!doctor) {
      return res.status(403).json({ message: "Only doctors can view alert stats" });
    }

    const stats = await alertService.getAlertStats(doctor.id);
    res.status(200).json({
      message: "Alert stats retrieved successfully",
      data: stats,
    });
  } catch (error: any) {
    console.error("[Alert Controller Error]", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
