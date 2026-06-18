import express from "express";
import {
  getMyHealthProfile,
  updateHealthProfile,
} from "../controllers/healthController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my", protect, getMyHealthProfile);
router.put("/", protect, updateHealthProfile);

export default router;
