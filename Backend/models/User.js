import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpire: {
      type: Date,
    },

    phone: {
      type: String,
    },

    profileImage: {
      type: String,
    },

    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
    },

    specialization: {
      type: String,
    },

    experience: {
      type: Number,
    },

    fees: {
      type: Number,
    },

    availability: {
      type: [String],
      default: [],
    },

    bio: {
      type: String,
    },

    notificationPreferences: {
      appointmentAlerts: {
        type: Boolean,
        default: true,
      },

      medicalReports: {
        type: Boolean,
        default: true,
      },

      aiSuggestions: {
        type: Boolean,
        default: false,
      },
    },

    appearanceSettings: {
      darkMode: {
        type: Boolean,
        default: false,
      },

      compactLayout: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
