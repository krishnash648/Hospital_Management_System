import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import {
  analyzeReport,
  getMyReports,
  getDoctorReports,
  updateDoctorNotes,
} from "../controllers/reportAnalyzeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/analyze", protect, upload.single("report"), analyzeReport);

router.get("/my", protect, getMyReports);

router.get("/doctor", protect, getDoctorReports);

router.put("/:id/notes", protect, updateDoctorNotes);

export default router;
