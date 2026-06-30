import express from "express";
import {
  createReview,
  getDoctorReviews,
} from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Patient creates review
router.post("/", protect, createReview);

// Get all reviews for doctor
router.get("/:id", getDoctorReviews);

export default router;
