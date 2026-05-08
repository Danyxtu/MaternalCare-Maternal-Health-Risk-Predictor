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
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid patient ID" });
    }

    const doctorId = (req.user as any).doctorId;
    const role = (req.user as any).role;

    if (role === "DOCTOR") {
      if (!doctorId) {
        return res.status(403).json({ message: "Doctor profile not found" });
      }

      // Check if doctor has access via assessment OR access code (valid for 24h)
      const hasAccess = await prisma.patient.findFirst({
        where: {
          id,
          OR: [
            {
              assessments: {
                some: { doctorId }
              }
            },
            {
              accessCodes: {
                some: { 
                  usedById: doctorId,
                  usedAt: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
                  }
                }
              }
            }
          ]
        }
      });

      if (!hasAccess) {
        return res.status(403).json({ message: "You do not have permission to view this patient's records" });
      }
    } else if (role === "PATIENT") {
      // Patients can only view their own record
      const patientId = (req.user as any).patientId;
      if (patientId !== id) {
        return res.status(403).json({ message: "You can only view your own records" });
      }
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

export const generateCode = async (req: Request, res: Response) => {
  try {
    const patientId = (req.user as any).patientId;
    if (!patientId) {
      return res.status(403).json({ message: "Patient record not found" });
    }

    const accessCode = await patientService.generateAccessCode(patientId);
    res.status(200).json({
      message: "Access code generated successfully",
      data: {
        code: accessCode.code,
        expiresAt: accessCode.expiresAt,
      },
    });
  } catch (error: any) {
    console.error("[Patient Controller Error]", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyCode = async (req: Request, res: Response) => {
  try {
    const doctorId = (req.user as any).doctorId;
    if (!doctorId) {
      return res.status(403).json({ message: "Doctor record not found" });
    }

    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: "Access code is required" });
    }

    const result = await patientService.verifyAccessCode(code, doctorId);
    res.status(200).json({
      message: "Access code verified successfully",
      data: {
        patientId: result.patientId,
      },
    });
  } catch (error: any) {
    if (error.message === "INVALID_CODE") {
      return res.status(400).json({ message: "Invalid access code" });
    }
    if (error.message === "CODE_EXPIRED") {
      return res.status(400).json({ message: "Access code has expired" });
    }
    if (error.message === "CODE_ALREADY_USED") {
      return res.status(400).json({ message: "Access code has already been used" });
    }
    console.error("[Patient Controller Error]", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
