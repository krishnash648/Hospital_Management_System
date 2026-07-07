import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    department: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "completed", "cancelled", "rejected"],
      default: "pending",
    },

    notes: {
      type: String,
    },

    meetingLink: {
      type: String,
      default: "",
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },

    feedback: {
      type: String,
      default: "",
    },

    feedbackDate: {
      type: Date,
      default: null,
    },

    doctorReply: {
      type: String,
      default: "",
    },

    doctorReplyDate: {
      type: Date,
      default: null,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    paymentAmount: {
      type: Number,
      default: 0,
    },

    paymentMethod: {
      type: String,
      default: "Not Selected",
    },

    transactionId: {
      type: String,
      default: "",
    },

    invoiceNumber: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
