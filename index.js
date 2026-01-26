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

app.get("/", (req, res) => {
  res.send("Hotel Chatbot server is running 🚀");
});

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful hotel receptionist chatbot. Answer politely and help users with bookings, rooms, prices, and availability.",
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
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
