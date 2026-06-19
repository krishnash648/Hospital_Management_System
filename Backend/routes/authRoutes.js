import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  updateProfile,
  changePassword,
  updatePreferences,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", protect, logoutUser);

router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

router.get("/me", protect, getMe);

router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.put("/preferences", protect, updatePreferences);

export default router;
