import { prisma } from "@/src/lib/prisma.ts";

export class PatientService {
  async getPatientSummaries(doctorId: number) {
    const patients = await prisma.patient.findMany({
      where: {
        OR: [
          {
            assessments: {
              some: {
                doctorId: doctorId
              }
            }
          },
          {
            accessCodes: {
              some: {
                usedById: doctorId,
                usedAt: {
                  gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Access valid for 24 hours
                }
              }
            }
          }
        ]
      },
      include: {
        assessments: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      }
    });

    return patients.map((p) => {
      const latestAssessment = p.assessments[0];
      let bp: string | undefined = undefined;
      
      if (latestAssessment && latestAssessment.physiological_data) {
        const physData = latestAssessment.physiological_data as any;
        if (physData.SystolicBP && physData.DiastolicBP) {
          bp = `${physData.SystolicBP}/${physData.DiastolicBP}`;
        }
      }

      let riskLevel = "low";
      if (latestAssessment && latestAssessment.risk_label) {
        const label = latestAssessment.risk_label.toLowerCase();
        if (label.includes("high")) riskLevel = "high";
        else if (label.includes("mid") || label.includes("medium")) riskLevel = "medium";
      }

      return {
        id: p.id.toString(),
        name: `${p.first_name} ${p.last_name}`,
        age: p.age,
        bp,
        risk: riskLevel,
      };
    });
  }

  async getPatientDetail(id: number) {
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        assessments: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!patient) return null;

    return {
      id: patient.id.toString(),
      name: `${patient.first_name} ${patient.last_name}`,
      age: patient.age,
      contact: patient.contact,
      assessments: patient.assessments.map(a => {
        const physData = a.physiological_data as any;
        return {
          id: a.id.toString(),
          date: a.createdAt.toISOString(),
          systolic: physData.SystolicBP || 0,
          diastolic: physData.DiastolicBP || 0,
          bloodSugar: physData.BS || physData.BloodSugar || 0,
          heartRate: physData.HeartRate || 0,
          bodyTemp: physData.BodyTemp || physData.BodyTemperature || 98.6,
          riskLevel: a.risk_label,
          riskScore: a.risk_score,
          possible_maternal_risks: a.possible_maternal_risks,
          recommendations: a.recommendations,
          note: a.notes
        };
      })
    };
  }

  async getPatientPersonalDashboard(patientId: number) {
    const assessment = await prisma.assessment.findFirst({
      where: { patientId },
      orderBy: { createdAt: "desc" },
      include: {
        doctor: true,
      },
    });

    if (!assessment) return null;

    const physData = assessment.physiological_data as any;
    return {
      id: assessment.id,
      date: assessment.createdAt,
      risk_label: assessment.risk_label,
      risk_score: assessment.risk_score,
      vitals: {
        systolic: physData.SystolicBP,
        diastolic: physData.DiastolicBP,
        bloodSugar: physData.BS,
        heartRate: physData.HeartRate,
        bodyTemp: physData.BodyTemp,
      },
      doctor: assessment.doctor
        ? {
            id: assessment.doctor.id,
            name: `Dr. ${assessment.doctor.first_name} ${assessment.doctor.last_name}`,
          }
        : null,
      recommendations: assessment.recommendations,
    };
  }

  async getPatientDoctors(patientId: number) {
    const assessments = await prisma.assessment.findMany({
      where: { patientId },
      include: {
        doctor: true,
      },
      distinct: ["doctorId"],
    });

    return assessments
      .filter((a) => a.doctor !== null)
      .map((a) => ({
        id: a.doctor!.id,
        name: `Dr. ${a.doctor!.first_name} ${a.doctor!.last_name}`,
        specialty: "Maternal Health Specialist", // Placeholder
        contact: a.doctor!.contact,
      }));
  }

  async generateAccessCode(patientId: number) {
    // Generate a 6-digit random code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes

    const accessCode = await prisma.accessCode.create({
      data: {
        code,
        patientId,
        expiresAt,
      },
    });

    return accessCode;
  }

  async verifyAccessCode(code: string, doctorId: number) {
    const accessCode = await prisma.accessCode.findUnique({
      where: { code },
    });

    if (!accessCode) {
      throw new Error("INVALID_CODE");
    }

    if (accessCode.expiresAt < new Date()) {
      throw new Error("CODE_EXPIRED");
    }

    if (accessCode.usedAt) {
      throw new Error("CODE_ALREADY_USED");
    }

    // Update the code to mark it as used
    const updated = await prisma.accessCode.update({
      where: { id: accessCode.id },
      data: {
        usedById: doctorId,
        usedAt: new Date(),
      },
    });

    return updated;
  }
}
