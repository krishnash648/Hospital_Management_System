import express from "express";
import {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment,
} from "../controllers/appointmentController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, bookAppointment);
router.get("/my", protect, getMyAppointments);
router.get("/doctor", protect, getDoctorAppointments);
router.put("/:id", protect, updateAppointmentStatus);
router.delete("/:id", protect, cancelAppointment);

export default router;
