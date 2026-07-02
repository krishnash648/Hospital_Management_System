import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    suggestedSpecialist: {
      type: String,
      default: "",
    },

    title: {
      type: String,
      required: true,
    },

    reportType: {
      type: String,
    },

    fileUrl: {
      type: String,
    },

    findings: {
      type: String,
    },

    doctorNotes: {
      type: String,
    },

    analyzedResult: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const Report = mongoose.model("Report", reportSchema);

export default Report;
