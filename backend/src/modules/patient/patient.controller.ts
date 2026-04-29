import type { Request, Response } from "express";
import { PatientService } from "./patient.service.ts";

const patientService = new PatientService();

export const getPatients = async (req: Request, res: Response) => {
  try {
    const patients = await patientService.getPatientSummaries();
    res.status(200).json({
      message: "Patients retrieved successfully",
      data: patients,
    });
  } catch (error: any) {
    console.error("[Patient Controller Error]", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPatientById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid patient ID" });
    }
    const patient = await patientService.getPatientDetail(id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json({
      message: "Patient retrieved successfully",
      data: patient,
    });
  } catch (error: any) {
    console.error("[Patient Controller Error]", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
