import { Router } from "express";
import * as accessCodeController from "./access-code.controller.ts";
import requireAuth from "../../middleware/auth.ts";

const router = Router();

router.post("/", requireAuth, accessCodeController.generateCode);
router.post("/validate", requireAuth, accessCodeController.validateCode);
router.get("/active", requireAuth, accessCodeController.getMyActiveCode);

export default router;
