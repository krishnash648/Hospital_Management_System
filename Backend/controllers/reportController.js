import Report from "../models/reportModel.js";

export const createReport = async (req, res) => {
  try {
    const { title, doctorNotes } = req.body;

    const report = await Report.create({
      patient: req.user._id,
      title,
      doctorNotes,
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({
      patient: req.user._id,
    });

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
