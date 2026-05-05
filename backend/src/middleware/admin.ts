import type { NextFunction, Request, Response } from "express";

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Access denied. Admin role required." });
  }
  next();
};

export default isAdmin;
