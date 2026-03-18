import { Router } from "express";
import type { Request, Response } from "express";
import { explainModel } from "@/src/controllers/predictController.ts";

const Routes = Router();

Routes.post("/explain", explainModel);

export default Routes;
