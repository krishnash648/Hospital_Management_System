import express from "express";
import multer from "multer";
import {
  analyzeReport,
  getMyReports,
} from "../controllers/reportAnalyzeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/analyze", protect, upload.single("report"), analyzeReport);
router.get("/my", protect, getMyReports);

export default router;
