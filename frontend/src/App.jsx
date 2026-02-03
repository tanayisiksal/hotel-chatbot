import React from "react";
import { useState } from "react";



function App() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! Welcome to our hotel 👋" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
  
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
  
    setIsTyping(true);
  
    try {
      const response = await fetch("https://hotel-chatbot-3ekv.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: input
        })
      });
  
      const data = await response.json();
  
      const botMessage = {
        sender: "bot",
        text: data.reply
      };
  
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Server error. Please try again." }
      ]);
    } finally {
      setIsTyping(false);
    }
  };
  
  
  

  return (
    <div className="app">
      <div className="chat-container">
        <div className="chat-header">
          🏨 Hotel Assistant
        </div>

        <div className="chat-messages">
          {messages.map((msg, i) => (
            
            <div key={i} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
          {isTyping && (
  <div className="message bot typing">
    Bot is typing…
  </div>
)}

          
        </div>

        <div className="chat-input">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
