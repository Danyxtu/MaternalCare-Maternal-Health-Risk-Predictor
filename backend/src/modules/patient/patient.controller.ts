import type { Request, Response } from "express";
import { PatientService } from "./patient.service.ts";
import { prisma } from "@/src/lib/prisma.ts";

const patientService = new PatientService();

export const getPatients = async (req: Request, res: Response) => {
  try {
    const userId = Number((req.user as any).id);
    const doctor = await prisma.doctor.findUnique({ where: { userId } });
    
    if (!doctor) {
      return res.status(403).json({ message: "Only doctors can view patients" });
    }

    const patients = await patientService.getPatientSummaries(doctor.id);
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

export const getMeDashboard = async (req: Request, res: Response) => {
  try {
    const patientId = (req.user as any).patientId;
    if (!patientId) {
      return res.status(403).json({ message: "Patient record not found" });
    }

    const dashboard = await patientService.getPatientPersonalDashboard(patientId);
    res.status(200).json({
      message: "Dashboard data retrieved successfully",
      data: dashboard,
    });
  } catch (error: any) {
    console.error("[Patient Controller Error]", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMeDoctors = async (req: Request, res: Response) => {
  try {
    const patientId = (req.user as any).patientId;
    if (!patientId) {
      return res.status(403).json({ message: "Patient record not found" });
    }

    const doctors = await patientService.getPatientDoctors(patientId);
    res.status(200).json({
      message: "Doctors retrieved successfully",
      data: doctors,
    });
  } catch (error: any) {
    console.error("[Patient Controller Error]", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
