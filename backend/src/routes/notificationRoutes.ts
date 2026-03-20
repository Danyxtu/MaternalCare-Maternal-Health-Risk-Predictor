import { Router } from "express";
import type { Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  console.log("list notifications");
  res.status(501).json({ message: "List notifications not implemented" });
});

router.get("/:id", (req: Request, res: Response) => {
  console.log("get notification", req.params.id);
  res.status(501).json({ message: "Get notification not implemented" });
});

router.post("/", (req: Request, res: Response) => {
  console.log("create notification", req.body);
  res.status(501).json({ message: "Create notification not implemented" });
});

router.put("/:id/read", (req: Request, res: Response) => {
  console.log("mark notification read", req.params.id);
  res.status(501).json({ message: "Mark notification read not implemented" });
});

export default router;
