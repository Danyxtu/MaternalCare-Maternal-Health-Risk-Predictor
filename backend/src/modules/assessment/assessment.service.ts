import { prisma } from "@/src/lib/prisma.ts";
import type { CreateAssessmentDto } from "./assessment.dto.ts";

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
      let patientId = dto.patientId;
      
      // Handle cases where patientId might be NaN or "null" string from mobile
      if (typeof patientId !== 'number' || isNaN(patientId)) {
        patientId = undefined;
      }

      if (!patientId && dto.patientName) {
        console.log("[AssessmentService] Resolving patient by name:", dto.patientName);
        const nameParts = dto.patientName.trim().split(/\s+/).filter(Boolean);
        const firstName = nameParts[0];
        const lastName = nameParts.at(-1);

        if (!firstName || !lastName) {
          throw new Error("Invalid patient name");
        }

        const patient = await prisma.patient.findFirst({
          where: {
            first_name: { equals: firstName, mode: "insensitive" },
            last_name: { equals: lastName, mode: "insensitive" },
          },
        });

        if (patient) {
          patientId = patient.id;
          console.log("[AssessmentService] Found existing patientId:", patientId);
        } else {
          console.log("[AssessmentService] Creating new patient:", firstName, lastName);
          // Create new patient
          const newPatient = await prisma.patient.create({
            data: {
              first_name: firstName,
              last_name: lastName,
              age: dto.patientAge ?? dto.physiological_data.Age ?? 0,
              contact: "N/A", // Default
            },
          });
          patientId = newPatient.id;
          console.log("[AssessmentService] Created new patientId:", patientId);
        }
      }

      if (!patientId) {
        console.error("[AssessmentService] Patient could not be resolved. DTO:", dto);
        throw new Error("Patient could not be resolved");
      }

      // 3. Get latest version for patient
      const lastAssessment = await prisma.assessment.findFirst({
        where: { patientId },
        orderBy: { version: "desc" },
      });

      const nextVersion = lastAssessment ? lastAssessment.version + 1 : 1;
      console.log("[AssessmentService] Next version for patientId", patientId, "is", nextVersion);

      // 4. Create Assessment
      const assessment = await prisma.assessment.create({
        data: {
          patientId,
          doctorId: doctor.id,
          version: nextVersion,
          physiological_data: dto.physiological_data,
          model_version: "1.0.0", // Default or from config
          risk_score: dto.probability,
          risk_label: dto.predicted_class,
          explanations: dto.features,
          possible_maternal_risks: dto.possible_maternal_risks,
          recommendations: dto.recommendations,
          notes: dto.notes ?? null,
        },
      });

      console.log("[AssessmentService] Assessment saved successfully. ID:", assessment.id);
      return assessment;
    } catch (error: any) {
      console.error("[AssessmentService Error]", error);
      throw error;
    }
  }
}
