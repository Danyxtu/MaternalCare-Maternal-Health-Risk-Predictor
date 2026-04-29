import { prisma } from "@/src/lib/prisma.ts";

export class PatientService {
  async getPatientSummaries() {
    const patients = await prisma.patient.findMany({
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
          bloodSugar: physData.BloodSugar || 0,
          heartRate: physData.HeartRate || 0,
          bodyTemp: physData.BodyTemperature || 37.0,
          riskLevel: a.risk_label,
          riskScore: a.risk_score,
          note: a.notes
        };
      })
    };
  }
}
