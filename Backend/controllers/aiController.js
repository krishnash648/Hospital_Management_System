import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY.trim(),
  baseURL: "https://api.groq.com/openai/v1",
});

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
You are an AI health assistant.

Rules:
- Always respond in clean markdown.
- Use headings when needed.
- Use bullet points for symptoms.
- Use numbered steps for remedies.
- Keep answers concise.
- Maximum 6-8 lines unless necessary.
- Highlight important things in bold.
- If symptoms seem serious, clearly advise doctor consultation.

Response format:

## Possible Causes
- Cause 1
- Cause 2

## What You Can Do
1. Step one
2. Step two

## See a Doctor If
- Warning sign 1
- Warning sign 2
`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    res.status(200).json({
      reply: completion.choices[0].message.content,
    });
  } catch (error) {
    console.log("AI ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
