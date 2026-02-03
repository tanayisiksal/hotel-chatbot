Hotel Reservation Chatbot

An AI-powered hotel reservation chatbot that allows users to interactively complete booking flows through natural language conversation.

🔗 Live Demo: https://hotel-chatbot-chi.vercel.app
🔗 Backend API: https://hotel-chatbot-3ekv.onrender.com

✨ Features
- Conversational hotel reservation flow
- Real-time chat UI built with React
- AI-powered responses using OpenAI
- Reservation data stored in Supabase
- Typing indicator and chat bubbles
- Fully deployed and accessible via browser

🛠️ Tech Stack
Frontend
- React
- Vite
- CSS
Backend
- Node.js
- Express
- OpenAI API
- Supabase
Deployment
- Frontend: Vercel
- Backend: Render

Project Structure

hotel-chatbot/
│
├── frontend/
│   └── React application
│
├── backend/
│   └── Node.js API
│
└── README.md

Running Locally(Optional)
Backend

cd backend
npm install
node index.js

Create a .env file inside backend:
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key

Frontend

cd frontend
npm install
npm run dev

Create a .env file inside frontend:
VITE_API_URL=http://localhost:3000

📌 Notes
Environment variables are not included in the repository for security reasons.
The live demo uses deployed backend services and does not require API keys from users.

👩‍💻 Author
Developed by Tanay Işıksal
Computer Engineering Graduate
Interested in AI, Data & Full-Stack Development