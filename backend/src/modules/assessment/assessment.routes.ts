import { Router } from "express";
import * as assessmentController from "./assessment.controller.ts";
import requireAuth from "@/src/middleware/auth.ts";

const router = Router();

router.post("/save-report", requireAuth, assessmentController.saveAssessment);

export default router;
