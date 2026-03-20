import { Router } from "express";
import type { Request, Response } from "express";
import { explainModel } from "@/src/controllers/predictController.ts";

const routes = Router();

routes.post("/explain", explainModel);

export default routes;
