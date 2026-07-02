import fs from "fs";
import { createRequire } from "module";
import OpenAI from "openai";
import Report from "../models/Report.js";
import Tesseract from "tesseract.js";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

export const analyzeReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    let extractedText = "";

    if (req.file.mimetype === "application/pdf") {
      const filePath = req.file.path;

      try {
        const dataBuffer = fs.readFileSync(filePath);
        const result = await pdfParse(dataBuffer);

        extractedText = result.text;
      } catch (pdfError) {
        console.log("PDF Parse Error:", pdfError.message);

        const {
          data: { text },
        } = await Tesseract.recognize(req.file.path, "eng");

        extractedText = text;
      }
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

Analyze and return ONLY this format:

Summary:
...

Abnormal findings:
...

Possible concerns:
...

Recommended precautions:
...

Suggested doctor specialist:
Choose ONLY ONE from this exact list:
Pediatrics
Orthopedics
Cardiology
Neurology
Oncology
Radiology
Physical Therapy
Dermatology
ENT
Gynecology

Return only one specialist name.
Do not explain.
`,
        },
        {
          role: "user",
          content: extractedText,
        },
      ],
    });

    const analysisResult = completion.choices[0].message.content;

    let suggestedSpecialist = "";

    const specialistMatch = analysisResult.match(
      /Suggested doctor specialist:\s*(.*)/i,
    );

    if (specialistMatch) {
      suggestedSpecialist = specialistMatch[1].trim();
    }
    const newReport = await Report.create({
      patient: req.user._id,
      doctor: null,
      suggestedSpecialist,
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
      suggestedSpecialist,
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

export const getDoctorReports = async (req, res) => {
  try {
    const reports = await Report.find({
      doctor: req.user._id,
    })
      .populate("patient", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch doctor reports",
    });
  }
};

export const updateDoctorNotes = async (req, res) => {
  try {
    const { doctorNotes } = req.body;

    const report = await Report.findOne({
      _id: req.params.id,
      doctor: req.user._id,
    });

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    report.doctorNotes = doctorNotes;

    await report.save();

    res.status(200).json({
      message: "Doctor notes updated successfully",
      report,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to update doctor notes",
    });
  }
};
