import { prisma } from "@/src/lib/prisma.ts";

export class AlertService {
  async getAlerts(doctorId: number) {
    const alerts = await prisma.alert.findMany({
      where: {
        status: 'OPEN',
        patient: {
          assessments: {
            some: {
              doctorId: doctorId
            }
          }
        }
      },
      include: {
        patient: true,
        assessment: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return alerts.map(alert => ({
      id: alert.id.toString(),
      patientId: alert.patientId.toString(),
      patientName: `${alert.patient.first_name} ${alert.patient.last_name}`,
      statusText: alert.severity, // CRITICAL, WARNING, INFO
      age: alert.patient.age,
      bp: (alert.assessment.physiological_data as any)?.BP || ((alert.assessment.physiological_data as any)?.SystolicBP ? `${(alert.assessment.physiological_data as any).SystolicBP}/${(alert.assessment.physiological_data as any).DiastolicBP}` : "N/A"),
      bloodSugar: (alert.assessment.physiological_data as any)?.BS || (alert.assessment.physiological_data as any)?.BloodSugar || 0,
      heartRate: (alert.assessment.physiological_data as any)?.HeartRate || 0,
      timeAgo: alert.createdAt.toISOString(),
      severity: alert.severity
    }));
  }

  async getAlertStats(doctorId: number) {
    const alerts = await prisma.alert.findMany({
      where: { 
        status: 'OPEN',
        patient: {
          assessments: {
            some: {
              doctorId: doctorId
            }
          }
        }
      }
    });

    return {
      total: alerts.length,
      high: alerts.filter(a => a.severity === 'CRITICAL').length,
      medium: alerts.filter(a => a.severity === 'WARNING').length,
      low: alerts.filter(a => a.severity === 'INFO').length,
    };
  }

  async getAlertDetail(id: number) {
    const alert = await prisma.alert.findUnique({
      where: { id },
      include: {
        patient: {
          include: {
            assessments: {
              orderBy: { createdAt: 'desc' },
              take: 5 // Get last 5 for trending
            }
          }
        },
        assessment: true
      }
    });

    if (!alert) return null;

    const currentPhysData = alert.assessment.physiological_data as any;
    
    // Format historical data for charts
    const history = alert.patient.assessments.map(a => {
      const pd = a.physiological_data as any;
      return {
        date: a.createdAt.toISOString(),
        systolic: pd.SystolicBP || 0,
        diastolic: pd.DiastolicBP || 0,
        bloodSugar: pd.BS || pd.BloodSugar || 0,
        heartRate: pd.HeartRate || 0,
        bodyTemp: pd.BodyTemp || pd.BodyTemperature || 0,
        riskScore: a.risk_score
      };
    }).reverse();

    // Map predictions to factors
    const predictions = [
      {
        factor: "Age",
        severity: alert.patient.age > 35 ? "HIGH" : (alert.patient.age > 30 ? "MEDIUM" : "LOW"),
        description: alert.patient.age > 35 ? "Advanced maternal age (>35)" : "Age within normal maternal range",
        value: alert.patient.age,
        unit: "years"
      },
      {
        factor: "Blood Pressure",
        severity: (currentPhysData.SystolicBP > 140 || currentPhysData.DiastolicBP > 90) ? "HIGH" : (currentPhysData.SystolicBP > 130 || currentPhysData.DiastolicBP > 80 ? "MEDIUM" : "LOW"),
        description: `BP is ${currentPhysData.SystolicBP}/${currentPhysData.DiastolicBP} mmHg`,
        value: `${currentPhysData.SystolicBP}/${currentPhysData.DiastolicBP}`,
        unit: "mmHg"
      },
      {
        factor: "Blood Sugar",
        severity: (currentPhysData.BS > 11 || currentPhysData.BloodSugar > 11) ? "HIGH" : ((currentPhysData.BS > 7 || currentPhysData.BloodSugar > 7) ? "MEDIUM" : "LOW"),
        description: `Blood sugar is ${currentPhysData.BS || currentPhysData.BloodSugar} mmol/L`,
        value: currentPhysData.BS || currentPhysData.BloodSugar || 0,
        unit: "mmol/L"
      },
      {
        factor: "Heart Rate",
        severity: (currentPhysData.HeartRate > 100 || currentPhysData.HeartRate < 60) ? "HIGH" : "LOW",
        description: `Heart rate is ${currentPhysData.HeartRate} bpm`,
        value: currentPhysData.HeartRate || 0,
        unit: "bpm"
      },
      {
        factor: "Body Temperature",
        severity: (currentPhysData.BodyTemp > 100.4 || currentPhysData.BodyTemp < 97) ? "HIGH" : "LOW",
        description: `Body temperature is ${currentPhysData.BodyTemp} °F`,
        value: currentPhysData.BodyTemp || 0,
        unit: "°F"
      }
    ];

    return {
      id: alert.id.toString(),
      patientId: alert.patientId.toString(),
      patientName: `${alert.patient.first_name} ${alert.patient.last_name}`,
      age: alert.patient.age,
      overallRisk: alert.severity, // CRITICAL maps to HIGH, etc.
      severity: alert.severity,
      createdAt: alert.createdAt.toISOString(),
      physiologicalData: currentPhysData,
      predictions: predictions,
      recommendations: alert.assessment.recommendations || [],
      possibleRisks: alert.assessment.possible_maternal_risks || [],
      history: history
    };
  }
}
