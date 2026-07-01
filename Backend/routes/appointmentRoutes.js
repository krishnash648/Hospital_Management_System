import express from "express";
import {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  markAppointmentPaid,
  paymentSuccess,
  getAppointmentInvoice,
  cancelAppointment,
} from "../controllers/appointmentController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Book appointment
router.post("/", protect, bookAppointment);

// Patient routes
router.get("/my", protect, getMyAppointments);
router.put("/:id/cancel", protect, cancelAppointment);

// Payment routes
router.put("/:id/pay", protect, markAppointmentPaid);
router.put("/:id/payment-success", protect, paymentSuccess);
router.get("/:id/invoice", protect, getAppointmentInvoice);

// Doctor routes
router.get("/doctor", protect, getDoctorAppointments);
router.put("/:id/status", protect, updateAppointmentStatus);

export default router;
