const { createClient } = require("@supabase/supabase-js");

let bookingState = {
  checkIn: null,
  checkOut: null,
  guests: null,
  roomType: null,
  name: null,
  email: null
};

let conversationHistory = [];

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

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);


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
    // 1️⃣ Kullanıcının mesajını hafızaya ekle
    conversationHistory.push({ role: "user", content: userMessage });

    // 2️⃣ ========== CALL 1: NORMAL CHAT CEVABI ==========
    const chatMessages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory
    ];

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: chatMessages
    });

    const aiReply = chatCompletion.choices[0].message.content;

    // 3️⃣ ========== CALL 2: JSON EXTRACTION ==========
    const extractionPrompt = `
You are an information extraction engine for a hotel booking chatbot.

Current booking state:
checkIn: ${bookingState.checkIn}
checkOut: ${bookingState.checkOut}
guests: ${bookingState.guests}
roomType: ${bookingState.roomType}
name: ${bookingState.name}
email: ${bookingState.email}

Rules:
- The user message is an answer to the NEXT missing field.
- If a date is provided and checkIn is already filled, it MUST be checkOut.
- If a number is provided and guests is empty, it MUST be guests.
- If the message contains a room type (single, double, suite), it MUST be roomType.
- If the message looks like a name, it MUST be name.
- If the message looks like an email, it MUST be email.
- Do NOT overwrite existing non-null fields.
- Return ONLY valid JSON in this exact format:

{
  "checkIn": string | null,
  "checkOut": string | null,
  "guests": string | null,
  "roomType": string | null,
  "name": string | null,
  "email": string | null
}

User message:
"${userMessage}"
`;


    const extractionCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: extractionPrompt }]
    });

    const extractedText = extractionCompletion.choices[0].message.content;
console.log("📄 Raw extraction text:", extractedText);

let extractedData = null;

try {
  extractedData = JSON.parse(extractedText);
} catch (e) {
  console.log("Extraction JSON parse failed (normal sometimes)");
}


    // 4️⃣ bookingState'i güncelle
  
    // 4️⃣ bookingState'i güncelle

if (extractedData) {
  console.log("🧠 Extracted JSON:", extractedData);

  if (extractedData.checkIn && !bookingState.checkIn) {
    bookingState.checkIn = extractedData.checkIn;
  }

  if (extractedData.checkOut) {
    bookingState.checkOut = extractedData.checkOut;
  }

  if (extractedData.guests) {
    bookingState.guests = extractedData.guests;
  }

  if (extractedData.roomType) {
    bookingState.roomType = extractedData.roomType;
  } else if (extractedData.room) {
    bookingState.roomType = extractedData.room;
  }

  if (extractedData.name) {
    bookingState.name = extractedData.name;
  }

  if (extractedData.email) {
    bookingState.email = extractedData.email;
  }
} else {
  console.log("⚠️ No extractedData from AI for this message");
}

    // 5️⃣ Bot cevabını hafızaya ekle
    conversationHistory.push({ role: "assistant", content: aiReply });

    // ✅ If user confirms, save to DB
if (
  bookingState.checkIn &&
  bookingState.checkOut &&
  bookingState.guests &&
  bookingState.roomType &&
  bookingState.name &&
  bookingState.email &&
  userMessage.toLowerCase().includes("yes")
) {
  const { data, error } = await supabase.from("bookings").insert([
    {
      check_in: bookingState.checkIn,
      check_out: bookingState.checkOut,
      guests: bookingState.guests,
      room_type: bookingState.roomType,
      name: bookingState.name,
      email: bookingState.email
    }
  ]);

  if (error) {
    console.error("Supabase insert error:", error.message);
    return res.json({
      reply: "Something went wrong saving your reservation 😔"
    });
  }

  // 🎉 Reset state
  bookingState = {
    checkIn: null,
    checkOut: null,
    guests: null,
    roomType: null,
    name: null,
    email: null
  };

  conversationHistory = [];

  return res.json({
    reply: "🎉 Your reservation is confirmed! We’ve saved your booking. See you soon!"
  });
}


    res.json({ reply: aiReply, bookingState });
  } catch (error) {
    console.error("OpenAI error:", error.message);
    res.status(500).json({ error: "Something went wrong with AI 🤖" });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
