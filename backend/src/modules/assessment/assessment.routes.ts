import { Router } from "express";
import type { Request, Response } from "express";

const router = Router();

// Skeleton endpoint for assessment processing
router.post("/assess", (req: Request, res: Response) => {
  console.log("this is assess route");
  res
    .status(501)
    .json({ message: "Assessment processing not implemented yet" });
});

export default router;
