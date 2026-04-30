import { Router } from "express";
import { getAlerts, getAlertStats } from "./alert.controller.ts";
import requireAuth from "@/src/middleware/auth.ts";

const router = Router();

router.use(requireAuth);

router.get("/", getAlerts);
router.get("/stats", getAlertStats);

export default router;
