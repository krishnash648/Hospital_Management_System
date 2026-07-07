import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import Report from "../models/Report.js";
import Prescription from "../models/Prescription.js";
import sendEmail from "../utils/sendEmail.js";

// Get all doctors
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("-password");

    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get doctor by ID
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await User.findOne({
      _id: req.params.id,
      role: "doctor",
    }).select("-password");

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get doctors by department
export const getDoctorsByDepartment = async (req, res) => {
  try {
    const doctors = await User.find({
      role: "doctor",
      specialization: req.params.department,
    }).select("-password");

    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get doctor appointments
export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.user._id,
    })
      .populate("patient", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get doctor reports
export const getDoctorReports = async (req, res) => {
  try {
    const reports = await Report.find({
      doctor: req.user._id,
    })
      .populate("patient", "name email")
      .populate("doctor", "name specialization")
      .sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Approve appointment
export const approveAppointment = async (req, res) => {
  try {
    const { meetingLink } = req.body;

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
    appointment.meetingLink = meetingLink;

    await appointment.save();

    const patient = await User.findById(appointment.patient);

    if (patient) {
      patient.notifications.push({
        message: `Appointment approved. Join link available now.`,
        read: false,
      });

      await patient.save();
    }

    res.status(200).json({
      message: "Appointment approved",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Reject appointment
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

    appointment.status = "rejected";
    await appointment.save();

    res.status(200).json({
      message: "Appointment rejected",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Complete appointment
export const completeAppointment = async (req, res) => {
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

    if (appointment.status !== "approved") {
      return res.status(400).json({
        message: "Only approved appointments can be completed",
      });
    }

    appointment.status = "completed";
    await appointment.save();

    res.status(200).json({
      message: "Appointment marked as completed",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Add doctor notes
export const addDoctorNotes = async (req, res) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      doctor: req.user._id,
    });

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
    res.status(500).json({
      message: error.message,
    });
  }
};

// Create prescription
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

    const updatedUser = await User.findByIdAndUpdate(
      patient,
      {
        $push: {
          notifications: {
            message: `New prescription added by Dr. ${req.user.name}`,
            read: false,
          },
        },
      },
      { new: true },
    );

    if (updatedUser) {
      sendEmail({
        to: updatedUser.email,
        subject: "New Prescription Added",
        html: `
    <h2>Prescription Uploaded</h2>
    <p>Dr. ${req.user.name} has added a new prescription for you.</p>
    <p><strong>Medicine:</strong> ${medicineName}</p>
    <p><strong>Dosage:</strong> ${dosage}</p>
    <p><strong>Duration:</strong> ${duration}</p>
    <p><strong>Notes:</strong> ${notes || "No notes"}</p>
  `,
      }).catch((err) => console.log("Prescription email failed:", err.message));
    }

    res.status(201).json({
      message: "Prescription created successfully",
      prescription,
    });
  } catch (error) {
    console.log("CREATE PRESCRIPTION ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Get doctor prescriptions
export const getDoctorPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({
      doctor: req.user._id,
    }).populate("patient", "name email");

    res.status(200).json(prescriptions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update prescription
export const updatePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findOne({
      _id: req.params.id,
      doctor: req.user._id,
    });

    if (!prescription) {
      return res.status(404).json({
        message: "Prescription not found",
      });
    }

    const { patient, medicineName, dosage, duration, notes } = req.body;

    prescription.patient = patient || prescription.patient;
    prescription.medicineName = medicineName || prescription.medicineName;
    prescription.dosage = dosage || prescription.dosage;
    prescription.duration = duration || prescription.duration;
    prescription.notes = notes || prescription.notes;

    await prescription.save();

    res.status(200).json({
      message: "Prescription updated",
      prescription,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete prescription
export const deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findOne({
      _id: req.params.id,
      doctor: req.user._id,
    });

    if (!prescription) {
      return res.status(404).json({
        message: "Prescription not found",
      });
    }

    await prescription.deleteOne();

    res.status(200).json({
      message: "Prescription deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getDoctorNotifications = async (req, res) => {
  try {
    const doctor = await User.findById(req.user._id).select("notifications");

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    const notifications = doctor.notifications.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const markNotificationsRead = async (req, res) => {
  try {
    const doctor = await User.findById(req.user._id);

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    doctor.notifications.forEach((notification) => {
      notification.read = true;
    });

    await doctor.save();

    res.status(200).json({
      message: "Notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
