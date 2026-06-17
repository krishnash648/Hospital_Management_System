import express from "express";
import {
  getAllDoctors,
  getDoctorById,
  getDoctorsByDepartment,
} from "../controllers/doctorController.js";

const router = express.Router();

router.get("/", getAllDoctors);
router.get("/department/:department", getDoctorsByDepartment);
router.get("/:id", getDoctorById);

export default router;
