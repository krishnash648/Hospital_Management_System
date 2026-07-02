import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import Report from "../models/Report.js";
import Prescription from "../models/Prescription.js";
import Review from "../models/Review.js";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

export const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      specialization,
      experience,
      fees,
      bio,
    } = req.body;

    const existingDoctor = await User.findOne({ email });

    if (existingDoctor) {
      return res.status(400).json({
        message: "Doctor already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "doctor",
      specialization,
      experience,
      fees,
      bio,
      profileImage: req.file ? `/uploads/${req.file.filename}` : "",
    });

    res.status(201).json({
      message: "Doctor added successfully",
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id);

    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    const { name, email, phone, specialization, experience, fees, bio } =
      req.body;

    doctor.name = name || doctor.name;
    doctor.email = email || doctor.email;
    doctor.phone = phone || doctor.phone;
    doctor.specialization = specialization || doctor.specialization;
    doctor.experience = experience || doctor.experience;
    doctor.fees = fees || doctor.fees;
    doctor.bio = bio || doctor.bio;

    if (req.file) {
      if (doctor.profileImage) {
        const oldImagePath = path.join(
          process.cwd(),
          doctor.profileImage.replace("/", ""),
        );

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      doctor.profileImage = `/uploads/${req.file.filename}`;
    }

    await doctor.save();

    res.status(200).json({
      message: "Doctor updated successfully",
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllDoctorsAdmin = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("-password");

    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: "patient" }).select("-password");

    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "name email")
      .populate("doctor", "name email specialization");

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveAppointmentAdmin = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    appointment.status = "approved";

    await appointment.save();

    res.status(200).json({
      message: "Appointment approved successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const rejectAppointmentAdmin = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    appointment.status = "rejected";

    await appointment.save();

    res.status(200).json({
      message: "Appointment rejected successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("patient", "name email")
      .populate("doctor", "name specialization");

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const totalDoctors = await User.countDocuments({ role: "doctor" });
    const totalPatients = await User.countDocuments({ role: "patient" });
    const totalAppointments = await Appointment.countDocuments();
    const totalReports = await Report.countDocuments();
    const totalPrescriptions = await Prescription.countDocuments();

    const pendingAppointments = await Appointment.countDocuments({
      status: "pending",
    });

    const completedAppointments = await Appointment.countDocuments({
      status: "completed",
    });

    const cancelledAppointments = await Appointment.countDocuments({
      status: "cancelled",
    });

    const revenueData = await Appointment.aggregate([
      {
        $match: {
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$paymentAmount" },
        },
      },
    ]);

    const doctorLoad = await Appointment.aggregate([
      {
        $group: {
          _id: "$doctor",
          totalAppointments: { $sum: 1 },
        },
      },
      {
        $sort: {
          totalAppointments: -1,
        },
      },
    ]);

    const populatedDoctorLoad = await User.populate(doctorLoad, {
      path: "_id",
      select: "name specialization",
    });

    const latestDoctor = await User.findOne({ role: "doctor" })
      .sort({ createdAt: -1 })
      .select("name specialization createdAt");

    const latestPatient = await User.findOne({ role: "patient" })
      .sort({ createdAt: -1 })
      .select("name createdAt");

    const latestAppointment = await Appointment.findOne()
      .sort({ createdAt: -1 })
      .populate("patient", "name")
      .populate("doctor", "name");

    res.status(200).json({
      totalDoctors,
      totalPatients,
      totalAppointments,
      totalReports,
      totalPrescriptions,
      pendingAppointments,
      completedAppointments,
      cancelledAppointments,
      totalRevenue: revenueData[0]?.totalRevenue || 0,
      doctorLoad: populatedDoctorLoad,
      latestDoctor,
      latestPatient,
      latestAppointment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await Appointment.deleteMany({
      $or: [{ patient: user._id }, { doctor: user._id }],
    });

    await Report.deleteMany({
      $or: [{ patient: user._id }, { doctor: user._id }],
    });

    await Prescription.deleteMany({
      $or: [{ patient: user._id }, { doctor: user._id }],
    });

    await Review.deleteMany({
      $or: [{ patient: user._id }, { doctor: user._id }],
    });

    if (user.profileImage) {
      const imagePath = path.join(
        process.cwd(),
        user.profileImage.replace("/", ""),
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await user.deleteOne();

    res.status(200).json({
      message: "User and related records deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
