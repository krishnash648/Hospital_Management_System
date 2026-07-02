import Prescription from "../models/Prescription.js";
import User from "../models/User.js";

export const createPrescription = async (req, res) => {
  try {
    const { patient, medicineName, dosage, duration, notes } = req.body;

    console.log("Patient ID:", patient);
    console.log("Doctor:", req.user.name);

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

    if (!updatedUser) {
      console.log("Patient not found for notification");
    } else {
      console.log("Notification added successfully");
    }

    res.status(201).json({
      message: "Prescription created successfully",
      prescription,
    });
  } catch (error) {
    console.log("CREATE PRESCRIPTION ERROR:", error.message);

    res.status(500).json({
      message: error.message,
    });
  }
};

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

    Object.assign(prescription, req.body);
    await prescription.save();

    res.status(200).json({
      message: "Prescription updated successfully",
      prescription,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

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
