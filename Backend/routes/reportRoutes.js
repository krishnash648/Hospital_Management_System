import express from "express";
import { getMyReports, createReport } from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createReport);
router.get("/my", protect, getMyReports);

export default router;
