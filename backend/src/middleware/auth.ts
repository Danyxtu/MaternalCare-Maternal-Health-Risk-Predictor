import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import "@/src/types/express.d.ts"; // Import your custom type definitions
import { prisma } from "../lib/prisma.ts";

const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  // 1. Get token from header (Format: "Bearer <token>")
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // 2. Verify token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ error: "JWT secret is not configured." });
    }
    const verified = jwt.verify(token, jwtSecret);

    // 3. Attach user data to the request object for later use
    if (typeof verified !== "object" || verified === null) {
      return res.status(401).json({ error: "Invalid token payload." });
    }

    const email = (verified as any).email;
    const idRaw = (verified as any).id;

    if (typeof email !== "string" || !email) {
      return res.status(401).json({ error: "Invalid token payload." });
    }

    const id = typeof idRaw === "number" ? idRaw : Number(idRaw);
    if (!Number.isFinite(id)) {
      return res.status(401).json({ error: "Invalid token payload." });
    }

    // Verify user still exists in DB and get their profile IDs
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        patient: { select: { id: true } },
        doctor: { select: { id: true } },
      },
    });

    if (!user) {
      return res.status(401).json({ error: "User no longer exists. Session invalid." });
    }

    req.user = { 
      email: user.email, 
      id: user.id,
      patientId: user.patient?.id,
      doctorId: user.doctor?.id,
      role: user.role
    };
    // 4. Move to the next function
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token." });
  }
};

export default requireAuth;
