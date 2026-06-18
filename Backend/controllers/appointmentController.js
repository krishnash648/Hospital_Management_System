import Appointment from "../models/Appointment.js";

// Patient books appointment
export const bookAppointment = async (req, res) => {
  try {
    const { doctor, department, date, time, notes } = req.body;

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor,
      department,
      date,
      time,
      notes,
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Patient gets own appointments
export const getMyAppointments = async (req, res) => {
  try {
    console.log("Logged in user ID:", req.user._id);

    const appointments = await Appointment.find({
      patient: req.user._id,
    }).populate("doctor", "name email role");

    console.log("Appointments found:", appointments);

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Doctor gets own assigned appointments
export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.user._id,
    }).populate("patient", "name email phone role");

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Doctor/Admin updates appointment status
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    appointment.status = status;

    const updatedAppointment = await appointment.save();

    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Patient cancels appointment
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    await appointment.deleteOne();

    res.status(200).json({
      message: "Appointment cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
