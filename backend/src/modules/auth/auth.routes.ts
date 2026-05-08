import { Router } from "express";
import { register, login, forgotPassword, resetPassword } from "./auth.controller.ts";
import requireAuth from "@/src/middleware/auth.ts";
import type { Request, Response } from "express";
import { prisma } from "@/src/lib/prisma.ts";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
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

router.put("/profile", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = Number((req.user as any).id);
    const { first_name, last_name, middle_initial, email } = req.body;

    if (!userId || Number.isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        first_name,
        last_name,
        middle_initial,
        email,
      },
    });

    await prisma.activity.create({
      data: {
        type: "PROFILE_UPDATED",
        message: `User profile updated: ${updatedUser.first_name} ${updatedUser.last_name}`,
        email: updatedUser.email,
      },
    });

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: "Email is already in use by another account." });
    }
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

export default router;
