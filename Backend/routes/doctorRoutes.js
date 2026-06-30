import express from "express";
import {
  getAllDoctors,
  getDoctorById,
  getDoctorsByDepartment,
  getDoctorAppointments,
  getDoctorReports,
  approveAppointment,
  rejectAppointment,
  completeAppointment,
  addDoctorNotes,
  createPrescription,
  getDoctorPrescriptions,
  updatePrescription,
  deletePrescription,
} from "../controllers/doctorController.js";

import { protect } from "../middleware/authMiddleware.js";
import { doctorOnly } from "../middleware/doctorMiddleware.js";

const router = express.Router();

router.get("/", getAllDoctors);
router.get("/department/:department", getDoctorsByDepartment);

router.get("/my-appointments", protect, doctorOnly, getDoctorAppointments);

// Reports
router.get("/reports", protect, doctorOnly, getDoctorReports);
router.put("/reports/:id/notes", protect, doctorOnly, addDoctorNotes);

// Appointment actions
router.put(
  "/appointments/:id/approve",
  protect,
  doctorOnly,
  approveAppointment,
);

router.put("/appointments/:id/reject", protect, doctorOnly, rejectAppointment);

router.put(
  "/appointments/:id/complete",
  protect,
  doctorOnly,
  completeAppointment,
);

// Prescriptions
router.post("/prescriptions", protect, doctorOnly, createPrescription);
router.get("/prescriptions", protect, doctorOnly, getDoctorPrescriptions);
router.put("/prescriptions/:id", protect, doctorOnly, updatePrescription);
router.delete("/prescriptions/:id", protect, doctorOnly, deletePrescription);

router.get("/:id", getDoctorById);

export default router;
