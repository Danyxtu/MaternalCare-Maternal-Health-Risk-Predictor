import { Router } from "express";
import type { Request, Response } from "express";
import { register, login } from "@/src/controllers/authController.ts";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/profile", (req: Request, res: Response) => {
  res.json({ message: "User profile data" });
});

export default router;
