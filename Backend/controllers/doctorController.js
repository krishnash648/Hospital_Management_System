import User from "../models/User.js";

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
