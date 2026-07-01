import express from "express";
import {
  addDoctor,
  updateDoctor,
  getAllUsers,
  getAllDoctorsAdmin,
  getAllPatients,
  getAllAppointments,
  approveAppointmentAdmin,
  rejectAppointmentAdmin,
  getAllReports,
  getAdminStats,
  deleteUser,
} from "../controllers/adminController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/stats", protect, adminOnly, getAdminStats);

router.get("/users", protect, adminOnly, getAllUsers);

router.get("/doctors", protect, adminOnly, getAllDoctorsAdmin);

router.post(
  "/doctor",
  protect,
  adminOnly,
  upload.single("profileImage"),
  addDoctor,
);

router.put(
  "/doctor/:id",
  protect,
  adminOnly,
  upload.single("profileImage"),
  updateDoctor,
);

router.get("/patients", protect, adminOnly, getAllPatients);

router.get("/appointments", protect, adminOnly, getAllAppointments);

router.put(
  "/appointments/:id/approve",
  protect,
  adminOnly,
  approveAppointmentAdmin,
);

router.put(
  "/appointments/:id/reject",
  protect,
  adminOnly,
  rejectAppointmentAdmin,
);

router.get("/reports", protect, adminOnly, getAllReports);

router.delete("/user/:id", protect, adminOnly, deleteUser);

export default router;
