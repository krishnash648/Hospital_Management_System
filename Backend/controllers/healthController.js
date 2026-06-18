import HealthProfile from "../models/HealthProfile.js";

export const getMyHealthProfile = async (req, res) => {
  try {
    const profile = await HealthProfile.findOne({
      patient: req.user._id,
    });

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateHealthProfile = async (req, res) => {
  try {
    const profile = await HealthProfile.findOneAndUpdate(
      { patient: req.user._id },
      req.body,
      { new: true, upsert: true },
    );

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
