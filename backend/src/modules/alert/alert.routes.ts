import { Router } from "express";
import { getAlerts, getAlertStats } from "./alert.controller.ts";

const router = Router();

router.get("/", getAlerts);
router.get("/stats", getAlertStats);

export default router;
