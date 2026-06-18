import mongoose from "mongoose";

const healthProfileSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    weight: {
      type: Number,
    },
    hydration: {
      type: Number,
    },
    heartRateStability: {
      type: Number,
    },
    sleepQuality: {
      type: Number,
    },
    bloodGroup: {
      type: String,
    },
  },
  { timestamps: true },
);

const HealthProfile = mongoose.model("HealthProfile", healthProfileSchema);

export default HealthProfile;
