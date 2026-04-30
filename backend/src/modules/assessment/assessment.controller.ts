import type { Request, Response } from "express";
import { AssessmentService } from "./assessment.service.ts";

const assessmentService = new AssessmentService();

export const saveAssessment = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const assessment = await assessmentService.saveAssessment(userId, req.body);

    res.status(201).json({
      message: "Assessment saved successfully",
      data: assessment,
    });
  } catch (error: any) {
    console.error("[Assessment Controller Error]", error);
    res.status(500).json({
      message: "Failed to save assessment",
      error: error.message,
    });
  }
};
