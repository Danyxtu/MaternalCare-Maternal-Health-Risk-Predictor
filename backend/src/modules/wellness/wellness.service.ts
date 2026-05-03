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
        water_intake: data.water_intake,
        diet_quality: data.diet_quality,
        stress_level: data.stress_level,
        supplements_taken: data.supplements_taken,
        mood: data.mood,
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
