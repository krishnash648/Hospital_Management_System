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
  getDoctorBookedSlots,
  rescheduleAppointment,
} from "../controllers/appointmentController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, bookAppointment);

router.get("/my", protect, getMyAppointments);
router.get("/doctor/:doctorId/:date", protect, getDoctorBookedSlots);

router.put("/:id/cancel", protect, cancelAppointment);

router.put("/:id/pay", protect, markAppointmentPaid);
router.put("/:id/payment-success", protect, paymentSuccess);
router.get("/:id/invoice", protect, getAppointmentInvoice);
router.put("/:id/reschedule", protect, rescheduleAppointment);
router.get("/doctor", protect, getDoctorAppointments);
router.put("/:id/status", protect, updateAppointmentStatus);

export default router;
