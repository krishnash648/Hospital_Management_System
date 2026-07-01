import Report from "../models/reportModel.js";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

export const createReport = async (req, res) => {
  try {
    const { title, doctorNotes } = req.body;

    const report = await Report.create({
      patient: req.user._id,
      title,
      doctorNotes,
    });

    const patient = await User.findById(req.user._id);

    if (patient) {
      await sendEmail({
        to: patient.email,
        subject: "Medical Report Uploaded",
        html: `
          <h2>New Medical Report Added</h2>
          <p>Your medical report has been uploaded successfully.</p>
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Doctor Notes:</strong> ${doctorNotes || "No notes"}</p>
        `,
      });
    }

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({
      patient: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
