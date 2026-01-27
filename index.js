console.log("Index.js started ✅");

require("dotenv").config();

const express = require("express");
const OpenAI = require("openai");

const app = express();
const PORT = 3000;

app.use(express.json());


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `
You are a helpful hotel receptionist chatbot.

Your job is to collect the following information from the user:
- Check-in date
- Check-out date
- Number of guests
- Room type (single, double, suite)
- Full name
- Email address

Rules:
- Ask only ONE question at a time.
- Be polite, friendly, and professional.
- Do NOT make up information.
- If the user goes off-topic, gently bring them back to booking a room.
- Once all details are collected, confirm the reservation and show a summary.
`;

app.get("/", (req, res) => {
  res.send("Hotel Chatbot server is running 🚀");
});

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ]
      
    });

    const reply = completion.choices[0].message.content;

    res.json({ reply });
  } catch (error) {
    console.error("OpenAI error:", error.message);
    res.status(500).json({ error: "Something went wrong with AI 🤖" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
