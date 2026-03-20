import { Router } from "express";
import type { Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  console.log("list patients");
  res.status(501).json({ message: "List patients not implemented" });
});

router.get("/:id", (req: Request, res: Response) => {
  console.log("get patient", req.params.id);
  res.status(501).json({ message: "Get patient not implemented" });
});

router.post("/", (req: Request, res: Response) => {
  console.log("create patient", req.body);
  res.status(501).json({ message: "Create patient not implemented" });
});

router.put("/:id", (req: Request, res: Response) => {
  console.log("update patient", req.params.id, req.body);
  res.status(501).json({ message: "Update patient not implemented" });
});

router.delete("/:id", (req: Request, res: Response) => {
  console.log("delete patient", req.params.id);
  res.status(501).json({ message: "Delete patient not implemented" });
});

export default router;
