import express from "express";
import multer from "multer";
import { analyzeReport } from "../controllers/reportAnalyzeController.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/analyze", upload.single("report"), analyzeReport);

export default router;
