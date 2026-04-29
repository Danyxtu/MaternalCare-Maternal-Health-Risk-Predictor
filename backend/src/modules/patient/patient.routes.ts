import { Router } from "express";
import type { Request, Response } from "express";
import { getPatients, getPatientById } from "./patient.controller.ts";

const router = Router();

router.get("/", getPatients);

router.get("/:id", getPatientById);

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
