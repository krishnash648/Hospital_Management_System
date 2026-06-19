import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import Report from "../models/Report.js";
import Prescription from "../models/Prescription.js";

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("-password");

    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const doctor = await User.findOne({
      _id: req.params.id,
      role: "doctor",
    }).select("-password");

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDoctorsByDepartment = async (req, res) => {
  try {
    const doctors = await User.find({
      role: "doctor",
      specialization: req.params.department,
    }).select("-password");

    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.user._id,
    })
      .populate("patient", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      doctor: req.user._id,
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    appointment.status = "approved";
    await appointment.save();

    res.status(200).json({
      message: "Appointment approved",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      doctor: req.user._id,
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    appointment.status = "cancelled";
    await appointment.save();

    res.status(200).json({
      message: "Appointment cancelled",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addDoctorNotes = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    report.doctorNotes = req.body.doctorNotes;
    await report.save();

    res.status(200).json({
      message: "Doctor notes added",
      report,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPrescription = async (req, res) => {
  try {
    const { patient, medicineName, dosage, duration, notes } = req.body;

    const prescription = await Prescription.create({
      patient,
      doctor: req.user._id,
      medicineName,
      dosage,
      duration,
      notes,
    });

    res.status(201).json({
      message: "Prescription created",
      prescription,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
