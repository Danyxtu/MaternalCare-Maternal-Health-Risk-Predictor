import { prisma } from "@/src/lib/prisma.ts";

export class PatientService {
  async getPatientSummaries(doctorId: number) {
    const patients = await prisma.patient.findMany({
      where: {
        assessments: {
          some: {
            doctorId: doctorId
          }
        }
      },
      include: {
        assessments: {
          where: {
            doctorId: doctorId
          },
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
          bodyTemp: physData.BodyTemp || physData.BodyTemperature || 37.0,
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
}
