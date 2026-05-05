import { Router } from "express";
import { getDoctors, approveDoctor, rejectDoctor, getStats, getUsers, addAdmin, deleteUser, getActivities } from "./admin.controller.ts";
import requireAuth from "@/src/middleware/auth.ts";
import isAdmin from "@/src/middleware/admin.ts";

const router = Router();

router.use(requireAuth);
router.use(isAdmin);

router.get("/users", getUsers);
router.get("/activities", getActivities);
router.post("/admins", addAdmin);
router.delete("/users/:id", deleteUser);
router.get("/doctors", getDoctors);
router.put("/doctors/:id/approve", approveDoctor);
router.put("/doctors/:id/reject", rejectDoctor);
router.get("/stats", getStats);

export default router;
