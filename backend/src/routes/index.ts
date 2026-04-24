import { Router } from "express";

// Imported Routes
import authRoutes from "@/src/modules/auth/auth.routes.ts";
import modelRoutes from "./model.ts";
import assessmentRoutes from "./assessmentRoutes.ts";
import patientRoutes from "./patientRoutes.ts";
import doctorRoutes from "./doctorRoutes.ts";
import alertRoutes from "./alertRoutes.ts";
import notificationRoutes from "./notificationRoutes.ts";

const router = Router();

// Routes
// Upgraded
router.use("/auth", authRoutes);

// Not yet upgraded
router.use("/model", modelRoutes);
router.use("/assessments", assessmentRoutes);
router.use("/patients", patientRoutes);
router.use("/doctors", doctorRoutes);
router.use("/alerts", alertRoutes);
router.use("/notifications", notificationRoutes);

export default router;
