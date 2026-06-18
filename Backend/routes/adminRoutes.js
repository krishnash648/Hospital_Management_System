import express from "express";
import {
  getAllUsers,
  getAllDoctorsAdmin,
  getAllPatients,
  getAllAppointments,
  deleteUser,
} from "../controllers/adminController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/users", protect, adminOnly, getAllUsers);

router.get("/doctors", protect, adminOnly, getAllDoctorsAdmin);

router.get("/patients", protect, adminOnly, getAllPatients);

router.get("/appointments", protect, adminOnly, getAllAppointments);

router.delete("/user/:id", protect, adminOnly, deleteUser);

export default router;
