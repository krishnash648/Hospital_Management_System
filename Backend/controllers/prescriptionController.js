import Prescription from "../models/Prescription.js";

export const getMyPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({
      patient: req.user._id,
    }).populate("doctor", "name");

    res.status(200).json(prescriptions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
