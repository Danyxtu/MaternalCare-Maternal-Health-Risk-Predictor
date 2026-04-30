import { Router } from "express";
import { register, login } from "./auth.controller.ts";
import requireAuth from "@/src/middleware/auth.ts";
import type { Request, Response } from "express";
import { prisma } from "@/src/lib/prisma.ts";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = Number((req.user as any).id);
    if (!userId || Number.isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        first_name: true,
        last_name: true,
        middle_initial: true,
        createdAt: true,
        doctor: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            middle_initial: true,
            contact: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        patient: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            middle_initial: true,
            age: true,
            contact: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User profile data", user });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

export default router;
