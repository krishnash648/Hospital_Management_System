import Appointment from "../models/Appointment.js";
import Prescription from "../models/Prescription.js";
import Report from "../models/Report.js";

export const getPatientTimeline = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patient: req.user._id,
    }).populate("doctor", "name");

    const prescriptions = await Prescription.find({
      patient: req.user._id,
    }).populate("doctor", "name");

    const reports = await Report.find({
      patient: req.user._id,
    }).populate("doctor", "name");

    const timeline = [];

    appointments.forEach((appointment) => {
      timeline.push({
        type: "appointment",
        title: `Appointment with Dr. ${appointment.doctor?.name || "Unknown"}`,
        status: appointment.status,
        date: appointment.createdAt,
      });

      if (appointment.paymentStatus === "paid") {
        timeline.push({
          type: "payment",
          title: `Payment Completed (₹${appointment.paymentAmount})`,
          status: appointment.paymentStatus,
          date: appointment.updatedAt,
        });
      }
    });

    prescriptions.forEach((prescription) => {
      timeline.push({
        type: "prescription",
        title: `Prescription: ${prescription.medicineName}`,
        status: "issued",
        date: prescription.createdAt,
      });
    });

    reports.forEach((report) => {
      timeline.push({
        type: "report",
        title: `Medical Report: ${report.title}`,
        status: "uploaded",
        date: report.createdAt,
      });
    });

    timeline.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json(timeline);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
