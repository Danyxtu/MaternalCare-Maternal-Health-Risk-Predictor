import { Router } from "express";

// Imported Routes
import authRoutes from "./authRoutes.ts";

const router = Router();

// Routes
router.use("/auth", authRoutes);

export default router;
