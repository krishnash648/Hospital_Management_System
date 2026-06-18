import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: String,
    fileUrl: String,
    doctorNotes: String,
  },
  { timestamps: true },
);

export default mongoose.model("Report", reportSchema);
