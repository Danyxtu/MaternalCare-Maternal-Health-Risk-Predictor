import { Router } from "express";
import type { Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  console.log("list alerts");
  res.status(501).json({ message: "List alerts not implemented" });
});

router.get("/:id", (req: Request, res: Response) => {
  console.log("get alert", req.params.id);
  res.status(501).json({ message: "Get alert not implemented" });
});

router.post("/", (req: Request, res: Response) => {
  console.log("create alert", req.body);
  res.status(501).json({ message: "Create alert not implemented" });
});

router.put("/:id", (req: Request, res: Response) => {
  console.log("update alert", req.params.id, req.body);
  res.status(501).json({ message: "Update alert not implemented" });
});

router.post("/:id/resolve", (req: Request, res: Response) => {
  console.log("resolve alert", req.params.id);
  res.status(501).json({ message: "Resolve alert not implemented" });
});

export default router;
