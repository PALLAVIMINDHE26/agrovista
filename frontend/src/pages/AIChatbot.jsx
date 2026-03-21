import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "../layouts/MainLayout";

const SUGGESTED_QUESTIONS = [
  "What are the best agrotourism destinations in India?",
  "How do I detect plant diseases?",
  "What is the best time to visit Kerala farms?",
  "Tell me about harvest festivals in India",
  "What activities are available at farm stays?",
];

export default function AIChatbot() {
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: "👋 Hello! I'm AgroVista AI Assistant. I can help you with agrotourism destinations, farming tips, plant diseases, Indian culture, and more. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Auto scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const userMessage = text || input.trim();
    if (!userMessage) return;

    // Add user message to chat
    const updatedMessages = [
      ...messages,
      { role: "user", text: userMessage }
    ];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8001/chat", {
        message: userMessage,
        history: messages.map((m) => ({
          role: m.role,
          text: m.text,
        })),
      });

      setMessages([
        ...updatedMessages,
        { role: "model", text: res.data.reply },
      ]);
    } catch (err) {
      setMessages([
        ...updatedMessages,
        {
          role: "model",
          text: "Sorry, I couldn't connect to the AI service. Please make sure the server is running.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "model",
        text: "👋 Hello! I'm AgroVista AI Assistant. How can I help you today?",
      },
    ]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.5 }}
    >
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6 md:p-10">

          {/* HEADER */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-green-700 mb-2">
              🤖 AgroVista AI Chatbot
            </h1>
            <p className="text-gray-600">
              Ask me anything about agrotourism, farming, plant diseases & Indian culture
            </p>
          </div>

          <div className="max-w-4xl mx-auto flex flex-col gap-6">

            {/* SUGGESTED QUESTIONS */}
            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="bg-white text-green-700 border border-green-300 px-4 py-2 rounded-full text-sm hover:bg-green-600 hover:text-white transition shadow-sm"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* CHAT WINDOW */}
            <div className="bg-white rounded-2xl shadow-xl flex flex-col h-[540px]">

              {/* Chat Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white text-lg">
                    🌿
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">AgroVista AI</p>
                    <p className="text-xs text-green-500">● Online</p>
                  </div>
                </div>
                <button
                  onClick={clearChat}
                  className="text-sm text-gray-400 hover:text-red-500 transition"
                >
                  Clear Chat
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                <AnimatePresence>
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {/* AI Avatar */}
                      {msg.role === "model" && (
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm mr-2 mt-1 flex-shrink-0">
                          🌿
                        </div>
                      )}

                      <div
                        className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                          msg.role === "user"
                            ? "bg-green-600 text-white rounded-br-none"
                            : "bg-gray-100 text-gray-800 rounded-bl-none"
                        }`}
                      >
                        {msg.text}
                      </div>

                      {/* User Avatar */}
                      {msg.role === "user" && (
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm ml-2 mt-1 flex-shrink-0">
                          👤
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Typing Indicator */}
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm mr-2 flex-shrink-0">
                      🌿
                    </div>
                    <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </motion.div>
                )}

                <div ref={bottomRef} />
              </div>

              {/* Input Area */}
              <div className="px-6 py-4 border-t flex gap-3 items-end">
                <textarea
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about agrotourism, plants, farming..."
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  className="bg-green-600 text-white px-5 py-3 rounded-xl hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-90" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>
                  </svg>
                </button>
              </div>
            </div>

          </div>
        </div>
      </MainLayout>
    </motion.div>
  );
}