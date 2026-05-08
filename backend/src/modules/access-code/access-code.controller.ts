import type { Request, Response } from "express";
import { AccessCodeService } from "./access-code.service.ts";

const accessCodeService = new AccessCodeService();

export const generateCode = async (req: Request, res: Response) => {
  try {
    const patientId = req.user?.patientId;
    if (!patientId) {
      return res.status(403).json({ error: "Only patients can generate access codes." });
    }

    // Check if there's already an active code
    const activeCode = await accessCodeService.getActiveCode(patientId);
    if (activeCode) {
      return res.json(activeCode);
    }

    const newCode = await accessCodeService.generateCode(patientId);
    res.status(201).json(newCode);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const validateCode = async (req: Request, res: Response) => {
  try {
    const doctorId = req.user?.doctorId;
    if (!doctorId) {
      return res.status(403).json({ error: "Only doctors can validate access codes." });
    }

    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: "Code is required." });
    }

    const patient = await accessCodeService.validateCode(code, doctorId);
    res.json({ message: "Access granted", patient });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getMyActiveCode = async (req: Request, res: Response) => {
  try {
    const patientId = req.user?.patientId;
    if (!patientId) {
      return res.status(403).json({ error: "Only patients can have access codes." });
    }

    const activeCode = await accessCodeService.getActiveCode(patientId);
    if (!activeCode) {
      return res.status(404).json({ error: "No active code found." });
    }

    res.json(activeCode);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
