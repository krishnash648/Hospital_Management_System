import fs from "fs";
import { createRequire } from "module";
import OpenAI from "openai";
import Report from "../models/Report.js";
import Appointment from "../models/Appointment.js";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

export const analyzeReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    let doctorId = req.body.doctorId;

    if (!doctorId) {
      const latestAppointment = await Appointment.findOne({
        patient: req.user._id,
      })
        .sort({ createdAt: -1 })
        .select("doctor");

      if (!latestAppointment?.doctor) {
        return res.status(400).json({
          message: "No appointment found. Please book an appointment first.",
        });
      }

      doctorId = latestAppointment.doctor;
    }

    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    let extractedText = "";

    if (req.file.mimetype === "application/pdf") {
      const filePath = req.file.path;

      const dataBuffer = fs.readFileSync(filePath);
      const result = await pdfParse(dataBuffer);

      extractedText = result.text;
    } else {
      extractedText =
        "Medical image uploaded. Manual AI image reading coming next.";
    }

    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
You are a medical report analysis assistant.

Analyze the report and return:
1. Summary
2. Abnormal findings
3. Possible concerns
4. Recommended precautions
5. Suggested doctor specialist

Keep it simple for patients.
`,
        },
        {
          role: "user",
          content: extractedText,
        },
      ],
    });

    const analysisResult = completion.choices[0].message.content;

    const newReport = await Report.create({
      patient: req.user._id,
      doctor: doctorId,
      title: req.file.originalname,
      reportType: req.file.mimetype,
      fileUrl: `/uploads/${req.file.filename}`,
      findings: extractedText,
      analyzedResult: analysisResult,
    });

    res.status(200).json({
      message: "Report analyzed successfully",
      report: newReport,
      analysis: analysisResult,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to analyze report",
    });
  }
};

export const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({
      patient: req.user._id,
    })
      .populate("doctor", "name specialization")
      .sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch reports",
    });
  }
};
