import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const registerUser = async (req, res) => {
  const { name, email, phone, password, role, specialization } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      specialization,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      specialization: user.specialization,
      notificationPreferences: user.notificationPreferences,
      appearanceSettings: user.appearanceSettings,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        specialization: user.specialization,
        notificationPreferences: user.notificationPreferences,
        appearanceSettings: user.appearanceSettings,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const logoutUser = async (req, res) => {
  res.status(200).json({
    message: "Logged out successfully",
  });
};

export const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

export const updateProfile = async (req, res) => {
  const { name, email, phone } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updatePreferences = async (req, res) => {
  const { notificationPreferences, appearanceSettings } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.notificationPreferences =
      notificationPreferences || user.notificationPreferences;

    user.appearanceSettings = appearanceSettings || user.appearanceSettings;

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Preferences updated successfully",
      notificationPreferences: updatedUser.notificationPreferences,
      appearanceSettings: updatedUser.appearanceSettings,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <h3>Password Reset</h3>
        <p>Click below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
      `,
    });

    res.status(200).json({
      message: "Reset password link sent to your email",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log("FORGOT PASSWORD ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
