console.log("Index.js started ✅");

const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hotel Chatbot server is running 🚀");
});

app.post("/chat", (req, res) => {
  const userMessage = req.body.message;

  console.log("User says:", userMessage);

  res.json({
    reply: `You said: ${userMessage}. (This will be AI later 🤖)`,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
