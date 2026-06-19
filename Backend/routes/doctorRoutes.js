import express from "express";
import {
  getAllDoctors,
  getDoctorById,
  getDoctorsByDepartment,
  getDoctorAppointments,
  approveAppointment,
  rejectAppointment,
  addDoctorNotes,
  createPrescription,
} from "../controllers/doctorController.js";
import { protect } from "../middleware/authMiddleware.js";
import { doctorOnly } from "../middleware/doctorMiddleware.js";

const router = express.Router();

router.get("/", getAllDoctors);
router.get("/department/:department", getDoctorsByDepartment);

router.get("/my-appointments", protect, doctorOnly, getDoctorAppointments);

router.put(
  "/appointments/:id/approve",
  protect,
  doctorOnly,
  approveAppointment,
);

router.put("/appointments/:id/reject", protect, doctorOnly, rejectAppointment);

router.put("/reports/:id/notes", protect, doctorOnly, addDoctorNotes);

router.post("/prescriptions", protect, doctorOnly, createPrescription);

router.get("/:id", getDoctorById);

export default router;
