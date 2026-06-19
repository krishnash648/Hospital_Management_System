import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { analyzeReport } from "../controllers/reportAnalyzeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/analyze", protect, upload.single("report"), analyzeReport);

export default router;
