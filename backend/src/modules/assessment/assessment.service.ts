import { prisma } from "@/src/lib/prisma.ts";
import type { CreateAssessmentDto } from "./assessment.dto.ts";
import { AlertSeverity, AlertStatus, AlertType } from "@/src/generated/prisma/index.js";

export class AssessmentService {
  async saveAssessment(userId: number, dto: CreateAssessmentDto) {
    try {
      console.log("[AssessmentService] Starting saveAssessment for userId:", userId);
      console.log("[AssessmentService] DTO:", JSON.stringify(dto, null, 2));

      // 1. Get Doctor ID from User ID
      let doctor = await prisma.doctor.findUnique({
        where: { userId },
      });

      if (!doctor) {
        console.warn("[AssessmentService] Doctor record missing for userId:", userId, ". Attempting to create one...");
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (user && user.role === "DOCTOR") {
            doctor = await prisma.doctor.create({
                data: {
                    userId: user.id,
                    first_name: user.first_name || "Doctor",
                    last_name: user.last_name || "User",
                    contact: "N/A"
                }
            });
            console.log("[AssessmentService] Auto-created Doctor record for userId:", userId);
        } else {
            console.error("[AssessmentService] User is not a DOCTOR or not found. userId:", userId);
            throw new Error("Doctor record not found and user role is invalid");
        }
      }
      console.log("[AssessmentService] Resolved doctorId:", doctor.id);

      // 2. Resolve Patient
      let patientId: number | undefined = undefined;
      
      // Try resolving by provided ID first (robust parsing)
      if (dto.patientId !== undefined && dto.patientId !== null) {
        const parsedId = parseInt(String(dto.patientId));
        if (!isNaN(parsedId)) {
          patientId = parsedId;
        }
      }

      if (!patientId && dto.patientName) {
        console.log("[AssessmentService] Resolving patient by name:", dto.patientName);
        const nameParts = dto.patientName.trim().split(/\s+/).filter(Boolean);
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts.at(-1) : "";

        if (!firstName) {
          throw new Error("Invalid patient name");
        }

        // Try to find existing patient by name (more flexible search)
        const patient = await prisma.patient.findFirst({
          where: {
            OR: [
              {
                AND: [
                  { first_name: { equals: firstName, mode: "insensitive" } },
                  { last_name: { equals: lastName || "", mode: "insensitive" } }
                ]
              },
              {
                user: {
                  OR: [
                    { first_name: { contains: firstName, mode: "insensitive" } },
                    { last_name: { contains: lastName || "", mode: "insensitive" } }
                  ]
                }
              }
            ]
          },
        });

        if (patient) {
          patientId = patient.id;
          console.log("[AssessmentService] Found existing patientId by name:", patientId);
        } else {
          console.log("[AssessmentService] Creating new patient:", firstName, lastName);
          const newPatient = await prisma.patient.create({
            data: {
              first_name: firstName,
              last_name: lastName || "Unknown",
              age: dto.patientAge ?? dto.physiological_data.Age ?? 0,
              contact: "N/A",
            },
          });
          patientId = newPatient.id;
          console.log("[AssessmentService] Created new patientId:", patientId);
        }
      }

      if (!patientId) {
        throw new Error("Patient could not be resolved");
      }

      // 3. Get latest version for patient
      const lastAssessment = await prisma.assessment.findFirst({
        where: { patientId },
        orderBy: { version: "desc" },
      });

      const nextVersion = lastAssessment ? lastAssessment.version + 1 : 1;

      // 4. Create Assessment and Manage Alerts in a single transaction
      const assessment = await prisma.$transaction(async (tx) => {
        const newAssessment = await tx.assessment.create({
          data: {
            patientId,
            doctorId: doctor.id,
            version: nextVersion,
            physiological_data: dto.physiological_data,
            model_version: "1.0.0",
            risk_score: dto.probability,
            risk_label: dto.predicted_class,
            explanations: dto.features,
            possible_maternal_risks: dto.possible_maternal_risks ?? [],
            recommendations: dto.recommendations ?? [],
            notes: dto.notes ?? null,
          },
        });

        // 5. Handle Alerts - Always base on the LATEST assessment
        console.log(`[AssessmentService] Managing alerts for patientId ${patientId}. Risk: ${dto.predicted_class}`);
        
        // Resolve ALL previous alerts for this patient
        await tx.alert.updateMany({
          where: {
            patientId: patientId,
            status: 'OPEN'
          },
          data: {
            status: 'RESOLVED',
            resolvedAt: new Date()
          }
        });

        // Create new alert if necessary
        const riskLower = dto.predicted_class.toLowerCase();
        let severity: string | null = null;
        if (riskLower.includes("high")) severity = 'CRITICAL';
        else if (riskLower.includes("mid") || riskLower.includes("moderate") || riskLower.includes("medium")) severity = 'WARNING';

        if (severity) {
          await tx.alert.create({
            data: {
              assessmentId: newAssessment.id,
              patientId: patientId,
              assigneeId: doctor.id,
              type: 'MATERNAL_RISK',
              severity: severity as any,
              status: 'OPEN',
              message: `${severity === 'CRITICAL' ? 'High' : 'Moderate'} risk detected for ${dto.patientName || 'patient'}`,
            }
          });
          console.log(`[AssessmentService] New ${severity} alert created.`);
        }

        return newAssessment;
      });

      return assessment;
    } catch (error: any) {
      console.error("[AssessmentService Error]", error);
      throw error;
    }
  }
}
