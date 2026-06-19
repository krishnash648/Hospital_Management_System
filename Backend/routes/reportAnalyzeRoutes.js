import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import {
  analyzeReport,
  getMyReports,
} from "../controllers/reportAnalyzeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/analyze", protect, upload.single("report"), analyzeReport);

router.get("/my", protect, getMyReports);

export default router;
