import { Router } from "express";

// Imported Routes
import authRoutes from "./authRoutes.ts";
import modelRoutes from "./model.ts";

const router = Router();

// Routes
router.use("/auth", authRoutes);
router.use("/model", modelRoutes);

export default router;
