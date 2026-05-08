import { Router } from "express";
import { getAlerts, getAlertStats, getAlertById } from "./alert.controller.ts";
import requireAuth from "@/src/middleware/auth.ts";

const router = Router();

router.use(requireAuth);

router.get("/", getAlerts);
router.get("/stats", getAlertStats);
router.get("/:id", getAlertById);

export default router;
