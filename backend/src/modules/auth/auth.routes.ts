import { Router } from "express";
import { register, login } from "./auth.controller.ts";
import requireAuth from "@/src/middleware/auth.ts";
import type { Request, Response } from "express";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", requireAuth, (req: Request, res: Response) => {
  res.json({ message: "User profile data", user: req.user });
});

export default router;
