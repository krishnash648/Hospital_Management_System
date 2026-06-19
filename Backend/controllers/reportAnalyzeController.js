import fs from "fs";
import { createRequire } from "module";
import OpenAI from "openai";

const require = createRequire(import.meta.url);
const { PDFParse } = require("pdf-parse");

export const analyzeReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    let extractedText = "";

    if (req.file.mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(req.file.path);
      const parser = new PDFParse({ data: dataBuffer });
      const result = await parser.getText();
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
        { role: "user", content: extractedText },
      ],
    });

    res.status(200).json({
      analysis: completion.choices[0].message.content,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to analyze report" });
  }
};
