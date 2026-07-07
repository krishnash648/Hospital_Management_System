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
  getNotifications,
  markNotificationsRead,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Auth
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", protect, logoutUser);

// Password
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

// Profile
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.put("/preferences", protect, updatePreferences);

// Notifications
router.get("/notifications", protect, getNotifications);
router.put("/notifications/read", protect, markNotificationsRead);
export default router;
