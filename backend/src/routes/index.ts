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
import accessCodeRoutes from "@/src/modules/access-code/access-code.routes.ts";
import adminRoutes from "@/src/modules/admin/admin.routes.ts";
import uploadRoutes from "@/src/modules/upload/upload.routes.ts";

const router = Router();

router.use("/auth", authRoutes);
router.use("/assessments", assessmentRoutes);
router.use("/notifications", notificationRoutes);
router.use("/alerts", alertRoutes);
router.use("/patients", patientRoutes);
router.use("/doctors", doctorRoutes);
router.use("/model", modelRoutes);
router.use("/wellness", wellnessRoutes);
router.use("/access-codes", accessCodeRoutes);
router.use("/admin", adminRoutes);
router.use("/upload", uploadRoutes);

export default router;
