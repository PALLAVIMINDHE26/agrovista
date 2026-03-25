import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

/* ============================================================
   CONSTANTS
============================================================ */
const SUGGESTED_QUESTIONS = [
  "What are the best agrotourism destinations in India?",
  "How do I detect plant diseases?",
  "What is the best time to visit Kerala farms?",
  "Tell me about harvest festivals in India",
  "What activities are available at farm stays?",
  "Which package is best for a family of 4?",
];

const FOOTER_LINKS = {
  Explore: [
    { label: "Destinations",     to: "/places"           },
    { label: "Culture",          to: "/culture"          },
    { label: "Activities",       to: "/activities"       },
    { label: "Book Now",         to: "/book-now"         },
    { label: "Blogs",            to: "/blogs"            },
    { label: "Birds",            to: "/birds"            },
  ],
  "AI Tools": [
    { label: "Disease Detector", to: "/disease-detector" },
    { label: "Trip Recommender", to: "/recommendation"   },
    { label: "AI Chatbot",       to: "/chatbot"          },
  ],
  Account: [
    { label: "Login",            to: "/login"            },
    { label: "Sign Up",          to: "/signup"           },
    { label: "My Dashboard",     to: "/dashboard"        },
    { label: "Admin Panel",      to: "/admin-dashboard"  },
  ],
};

/* ============================================================
   FOOTER
============================================================ */
function ChatbotFooter() {
  return (
    <footer className="bg-gray-950 text-white pt-14 pb-8 mt-auto">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-10 mb-10">
          <div className="md:col-span-2">
            <Link
              to="/"
              className="text-2xl font-black text-green-400 mb-3 block hover:text-green-300 transition-colors"
            >
              AgroVista 🌿
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              AI-powered agrotourism platform connecting you to authentic
              farm experiences, harvest festivals and rural culture across
              all of India.
            </p>
            {/* AI badge */}
            <div className="flex flex-wrap gap-2">
              {["🤖 Gemini AI", "🌿 Farm Expert", "💬 24/7 Chat"].map((b, i) => (
                <span
                  key={i}
                  className="text-xs bg-gray-800 text-gray-300 px-3 py-1.5 rounded-lg border border-gray-700"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="font-bold text-gray-200 mb-4 text-xs uppercase tracking-widest">
                {heading}
              </h3>
              <ul className="space-y-2.5">
                {links.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="text-gray-400 hover:text-green-400 text-sm transition-colors hover:underline underline-offset-2"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact strip */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="flex flex-wrap gap-6 justify-center md:justify-start text-sm text-gray-400">
            <span>📧 support@agrovista.com</span>
            <span>📞 +91 98765 43210</span>
            <span>📍 Rural India Network</span>
            <span>🕐 9 AM – 6 PM IST</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <span>© 2026 AgroVista. Made with 🌿 for Rural India.</span>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-green-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/" className="hover:text-green-400 transition-colors">
              Terms of Service
            </Link>
            <Link to="/chatbot" className="hover:text-green-400 transition-colors">
              AI Chatbot
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   MAIN COMPONENT
============================================================ */
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
  const navigate = useNavigate();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const userMessage = text || input.trim();
    if (!userMessage) return;

    const updatedMessages = [
      ...messages,
      { role: "user", text: userMessage },
    ];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8001/chat", {
        message: userMessage,
        history: messages.map((m) => ({ role: m.role, text: m.text })),
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
          text: "Sorry, I could not connect to the AI service. Please make sure the server is running on port 8001.",
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50"
    >
      <Navbar />

      {/* ===== HERO STRIP ===== */}
      <div className="mt-16 bg-gradient-to-r from-green-800 via-emerald-700 to-teal-700 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="max-w-5xl mx-auto px-6 py-8 flex items-center gap-6">
          <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 border border-white/20">
            🤖
          </div>
          <div>
            <p className="text-green-200 text-xs font-bold uppercase tracking-widest mb-1">
              Powered by Google Gemini AI
            </p>
            <h1
              className="text-2xl md:text-3xl font-black"
              style={{ fontFamily: "Georgia, serif" }}
            >
              AgroVista AI Chatbot
            </h1>
            <p className="text-green-100 text-sm mt-1">
              Ask me anything about agrotourism, farming, plant diseases &
              Indian culture
            </p>
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-grow max-w-5xl mx-auto w-full px-4 md:px-6 py-8 flex flex-col gap-6">

        {/* Suggested questions */}
        <div className="flex flex-wrap gap-2 justify-center">
          {SUGGESTED_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => sendMessage(q)}
              className="bg-white text-green-700 border border-green-200 px-4 py-2 rounded-full text-sm hover:bg-green-600 hover:text-white hover:border-green-600 transition-all duration-200 shadow-sm"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat window */}
        <div className="bg-white rounded-3xl shadow-xl flex flex-col flex-grow min-h-[500px] border border-gray-100 overflow-hidden">

          {/* Chat header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-lg shadow-md">
                🌿
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm">AgroVista AI</p>
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
                  Online · Gemini Powered
                </p>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors px-3 py-1.5 rounded-full hover:bg-red-50"
            >
              Clear Chat
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* AI Avatar */}
                  {msg.role === "model" && (
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm mr-2 mt-1 flex-shrink-0 shadow-sm">
                      🌿
                    </div>
                  )}

                  <div
                    className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-green-600 to-emerald-500 text-white rounded-br-none"
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* User Avatar */}
                  {msg.role === "user" && (
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm ml-2 mt-1 flex-shrink-0 shadow-sm">
                      👤
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm mr-2 flex-shrink-0">
                  🌿
                </div>
                <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex gap-3 items-end">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about agrotourism, plants, farming, festivals..."
              className="flex-1 border-2 border-gray-200 rounded-2xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-green-400 transition-colors bg-white"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="bg-gradient-to-br from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white px-5 py-3 rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 rotate-90"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Quick links to other AI tools */}
        <div className="grid sm:grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/disease-detector")}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-left hover:shadow-md hover:border-green-200 transition-all group"
          >
            <div className="text-2xl mb-2">🌿</div>
            <p className="font-bold text-gray-800 text-sm group-hover:text-green-700 transition-colors">
              Plant Disease Detector
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Upload a leaf photo for instant AI diagnosis
            </p>
          </button>
          <button
            onClick={() => navigate("/recommendation")}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-left hover:shadow-md hover:border-green-200 transition-all group"
          >
            <div className="text-2xl mb-2">🧠</div>
            <p className="font-bold text-gray-800 text-sm group-hover:text-green-700 transition-colors">
              AI Trip Recommender
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Get personalized farm stay recommendations
            </p>
          </button>
        </div>
      </div>

      <ChatbotFooter />
    </motion.div>
  );
}