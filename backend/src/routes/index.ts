import { Router } from "express";

// Imported Routes
import authRoutes from "@/src/modules/auth/auth.routes.ts";
import assessmentRoutes from "@/src/modules/assessment/assessment.routes.ts";
import notificationRoutes from "@/src/modules/notification/notification.routes.ts";
import alertRoutes from "@/src/modules/alert/alert.routes.ts";
import patientRoutes from "@/src/modules/patient/patient.routes.ts";
import doctorRoutes from "@/src/modules/doctor/doctor.routes.ts";
import modelRoutes from "@/src/modules/prediction/prediction.routes.ts";
import wellnessRoutes from "@/src/modules/wellness/wellness.routes.ts";

const router = Router();

router.use("/auth", authRoutes);
router.use("/assessments", assessmentRoutes);
router.use("/notifications", notificationRoutes);
router.use("/alerts", alertRoutes);
router.use("/patients", patientRoutes);
router.use("/doctors", doctorRoutes);
router.use("/model", modelRoutes);
router.use("/wellness", wellnessRoutes);

export default router;
