import express from "express";
import { getMyPrescriptions } from "../controllers/prescriptionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my", protect, getMyPrescriptions);

export default router;
