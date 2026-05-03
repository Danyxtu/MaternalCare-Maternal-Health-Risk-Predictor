import { Router } from "express";
import { createCheckIn, getWellnessHistory } from "./wellness.controller.ts";
import requireAuth from "@/src/middleware/auth.ts";

const router = Router();

router.use(requireAuth);

router.post("/check-in", createCheckIn);
router.get("/history", getWellnessHistory);

export default router;
