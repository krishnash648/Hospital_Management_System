import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    reportType: {
      type: String,
    },

    findings: {
      type: String,
    },

    doctorNotes: {
      type: String,
    },

    fileUrl: {
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
