import type { NextFunction, Request, Response } from "express";
import e from "express";
import jwt from "jsonwebtoken";
import "@/src/types/express.d.ts"; // Import your custom type definitions

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
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
    if (
      typeof verified === "object" &&
      verified !== null &&
      "email" in verified &&
      "id" in verified
    ) {
      req.user = { email: (verified as any).email, id: (verified as any).id };
      // 4. Move to the next function
      next();
    } else {
      return res.status(403).json({ error: "Invalid token payload." });
    }
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired token." });
  }
};

export default requireAuth;
