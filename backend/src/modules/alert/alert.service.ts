import { prisma } from "@/src/lib/prisma.ts";

export class AlertService {
  async getAlerts() {
    const alerts = await prisma.alert.findMany({
      where: {
        status: 'OPEN'
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
      patientName: `${alert.patient.first_name} ${alert.patient.last_name}`,
      statusText: alert.severity, // CRITICAL, WARNING, INFO
      age: alert.patient.age,
      bp: (alert.assessment.physiological_data as any)?.BP || "N/A",
      bloodSugar: (alert.assessment.physiological_data as any)?.BloodSugar || 0,
      heartRate: (alert.assessment.physiological_data as any)?.HeartRate || 0,
      timeAgo: alert.createdAt.toISOString(),
      severity: alert.severity
    }));
  }

  async getAlertStats() {
    const alerts = await prisma.alert.findMany({
      where: { status: 'OPEN' }
    });

    return {
      total: alerts.length,
      high: alerts.filter(a => a.severity === 'CRITICAL').length,
      medium: alerts.filter(a => a.severity === 'WARNING').length,
      low: alerts.filter(a => a.severity === 'INFO').length,
    };
  }
}
