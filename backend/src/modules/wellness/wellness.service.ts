import { prisma } from "@/src/lib/prisma.ts";
import { generateWellnessTips } from "@/src/lib/gemini.ts";
import type { CreateWellnessCheckDto } from "./wellness.dto.ts";

export class WellnessService {
  async createCheckIn(patientId: number, data: CreateWellnessCheckDto) {
    // Generate tips using Gemini
    const tips = await generateWellnessTips(data);

    // Save to database
    const wellnessCheck = await prisma.wellnessCheck.create({
      data: {
        patientId,
        sleep_hours: data.sleep_hours,
        water_intake: data.water_intake ?? null,
        diet_quality: data.diet_quality ?? null,
        stress_level: data.stress_level ?? null,
        supplements_taken: data.supplements_taken ?? null,
        mood: data.mood ?? null,
        tips: tips,
      },
    });

    return wellnessCheck;
  }

  async getHistory(patientId: number) {
    return prisma.wellnessCheck.findMany({
      where: { patientId },
      orderBy: { createdAt: "desc" },
    });
  }
}
