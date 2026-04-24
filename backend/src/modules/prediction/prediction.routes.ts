import { Router } from "express";
import { explainModel } from "./prediction.controller.ts";

const router = Router();

router.post("/explain", explainModel);

export default router;
