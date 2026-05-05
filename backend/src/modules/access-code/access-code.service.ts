import { prisma } from "@/src/lib/prisma.ts";

export class AccessCodeService {
  async generateCode(patientId: number) {
    // Generate a 6-digit alphanumeric code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes to scan

    return await prisma.accessCode.create({
      data: {
        code,
        patientId,
        expiresAt,
      },
    });
  }

  async validateCode(code: string, doctorId: number) {
    const accessCode = await prisma.accessCode.findUnique({
      where: { code },
      include: { patient: true },
    });

    if (!accessCode) {
      throw new Error("Invalid access code.");
    }

    if (accessCode.expiresAt < new Date()) {
      throw new Error("Access code has expired.");
    }

    if (accessCode.usedById) {
      // If already used by the same doctor, just return success
      if (accessCode.usedById === doctorId) {
        return accessCode.patient;
      }
      throw new Error("Access code has already been used by another doctor.");
    }

    // Mark as used by this doctor
    await prisma.accessCode.update({
      where: { id: accessCode.id },
      data: {
        usedById: doctorId,
        usedAt: new Date(),
      },
    });

    return accessCode.patient;
  }

  async getActiveCode(patientId: number) {
    return await prisma.accessCode.findFirst({
      where: {
        patientId,
        expiresAt: {
          gt: new Date(),
        },
        usedById: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
