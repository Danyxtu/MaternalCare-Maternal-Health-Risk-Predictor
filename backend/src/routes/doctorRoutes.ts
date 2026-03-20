import { Router } from "express";
import type { Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  console.log("list doctors");
  res.status(501).json({ message: "List doctors not implemented" });
});

router.get("/:id", (req: Request, res: Response) => {
  console.log("get doctor", req.params.id);
  res.status(501).json({ message: "Get doctor not implemented" });
});

router.post("/", (req: Request, res: Response) => {
  console.log("create doctor", req.body);
  res.status(501).json({ message: "Create doctor not implemented" });
});

router.put("/:id", (req: Request, res: Response) => {
  console.log("update doctor", req.params.id, req.body);
  res.status(501).json({ message: "Update doctor not implemented" });
});

router.delete("/:id", (req: Request, res: Response) => {
  console.log("delete doctor", req.params.id);
  res.status(501).json({ message: "Delete doctor not implemented" });
});

export default router;
