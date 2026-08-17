import { Router } from "express";
import { protectRoute } from "../middleware/protected.js";
import * as adminController from "../controllers/admin.controller.js";

const router = Router();

router.get("/reports", protectRoute, adminController.getReports);
router.put("/users/:id/block", protectRoute, adminController.blockUser);

export default router;