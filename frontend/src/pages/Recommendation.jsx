import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

/* ============================================================
   QUIZ STEPS
============================================================ */
const STEPS = [
  {
    id: "groupType",
    question: "Who are you travelling with?",
    emoji: "👥",
    options: [
      { label: "Solo",    emoji: "🧍", value: "solo"    },
      { label: "Couple",  emoji: "👫", value: "couple"  },
      { label: "Family",  emoji: "👨‍👩‍👧‍👦", value: "family"  },
      { label: "Friends", emoji: "🎉", value: "friends" },
    ],
  },
  {
    id: "budget",
    question: "What is your budget per person?",
    emoji: "💰",
    options: [
      { label: "Budget (< ₹1,000)",        emoji: "🪙", value: "budget under 1000"       },
      { label: "Mid (₹1,000 – ₹5,000)",    emoji: "💵", value: "mid range 1000 to 5000"  },
      { label: "Premium (₹5,000+)",         emoji: "💎", value: "premium above 5000"      },
      { label: "No Limit",                  emoji: "🤑", value: "no budget limit"         },
    ],
  },
  {
    id: "duration",
    question: "How long is your trip?",
    emoji: "⏳",
    options: [
      { label: "Day Trip",  emoji: "🌅", value: "1 day"              },
      { label: "Weekend",   emoji: "🏕️", value: "2-3 days"           },
      { label: "Week",      emoji: "📅", value: "5-7 days"           },
      { label: "Extended",  emoji: "✈️", value: "more than a week"   },
    ],
  },
  {
    id: "interest",
    question: "What are you most interested in?",
    emoji: "🎯",
    options: [
      { label: "Farming & Nature",    emoji: "🌾", value: "farming and nature"       },
      { label: "Culture & Festivals", emoji: "🎉", value: "culture and festivals"    },
      { label: "Adventure",           emoji: "🧗", value: "adventure and trekking"  },
      { label: "Relaxation",          emoji: "🧘", value: "relaxation and wellness" },
    ],
  },
  {
    id: "season",
    question: "Which season are you visiting?",
    emoji: "🌤️",
    options: [
      { label: "Winter (Oct–Feb)", emoji: "❄️", value: "winter"    },
      { label: "Summer (Mar–Jun)", emoji: "☀️", value: "summer"    },
      { label: "Monsoon (Jul–Sep)",emoji: "🌧️", value: "monsoon"   },
      { label: "Any Season",       emoji: "🗓️", value: "any season"},
    ],
  },
  {
    id: "state",
    question: "Any preferred state in India?",
    emoji: "🗺️",
    options: [
      { label: "Kerala",        emoji: "🌴", value: "Kerala"              },
      { label: "Punjab",        emoji: "🌾", value: "Punjab"              },
      { label: "Rajasthan",     emoji: "🏜️", value: "Rajasthan"           },
      { label: "No Preference", emoji: "🇮🇳", value: "any state in India" },
    ],
  },
];

/* ============================================================
   FOOTER LINKS
============================================================ */
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
    { label: "AI Chatbot",       to: "/chatbot"          },
    { label: "Disease Detector", to: "/disease-detector" },
    { label: "Trip Recommender", to: "/recommendation"   },
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
function RecommendFooter() {
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
              AI-powered trip planning for agrotourism across India —
              personalized farm stay recommendations tailored to your
              preferences, budget and travel style.
            </p>
            <div className="flex flex-wrap gap-2">
              {["🧠 Gemini AI", "🎯 Personalized", "🌾 60+ Destinations"].map(
                (b, i) => (
                  <span
                    key={i}
                    className="text-xs bg-gray-800 text-gray-300 px-3 py-1.5 rounded-lg border border-gray-700"
                  >
                    {b}
                  </span>
                )
              )}
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

        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="flex flex-wrap gap-6 justify-center md:justify-start text-sm text-gray-400">
            <span>📧 support@agrovista.com</span>
            <span>📞 +91 98765 43210</span>
            <span>📍 Rural India Network</span>
            <span>🕐 9 AM – 6 PM IST</span>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <span>© 2026 AgroVista. Made with 🌿 for Rural India.</span>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-green-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/" className="hover:text-green-400 transition-colors">
              Terms of Service
            </Link>
            <Link
              to="/recommendation"
              className="hover:text-green-400 transition-colors"
            >
              Trip Recommender
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
export default function Recommendation() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers]         = useState({});
  const [result, setResult]           = useState(null);
  const [loading, setLoading]         = useState(false);
  const [direction, setDirection]     = useState(1);
  const navigate = useNavigate();

  const handleSelect = async (value) => {
    const step = STEPS[currentStep];
    const updatedAnswers = { ...answers, [step.id]: value };
    setAnswers(updatedAnswers);

    if (currentStep < STEPS.length - 1) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    } else {
      // Last step — call API
      setLoading(true);
      try {
        const res = await axios.post(
          "http://localhost:8001/recommend",
          updatedAnswers
        );
        setResult(res.data);
      } catch (err) {
        console.error("Recommendation error:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
  };

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50"
    >
      <Navbar />

      {/* ===== HERO STRIP ===== */}
      <div className="mt-16 bg-gradient-to-r from-green-800 via-emerald-700 to-teal-700 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="max-w-5xl mx-auto px-6 py-8 flex items-center gap-6">
          <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 border border-white/20">
            🧠
          </div>
          <div>
            <p className="text-green-200 text-xs font-bold uppercase tracking-widest mb-1">
              Powered by Google Gemini AI
            </p>
            <h1
              className="text-2xl md:text-3xl font-black"
              style={{ fontFamily: "Georgia, serif" }}
            >
              AI Trip Recommender
            </h1>
            <p className="text-green-100 text-sm mt-1">
              Answer 6 quick questions and get your perfect agrotourism
              experience planned by AI
            </p>
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-grow max-w-2xl mx-auto w-full px-4 md:px-6 py-10">

        {/* ── QUIZ ── */}
        {!result && !loading && (
          <>
            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Step {currentStep + 1} of {STEPS.length}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-3 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>

            {/* Question card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: direction * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -60 }}
                transition={{ duration: 0.35 }}
                className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
              >
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">{STEPS[currentStep].emoji}</div>
                  <h2 className="text-2xl font-black text-gray-800">
                    {STEPS[currentStep].question}
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {STEPS[currentStep].options.map((option) => (
                    <motion.button
                      key={option.value}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleSelect(option.value)}
                      className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 hover:border-green-500 hover:bg-green-50 hover:shadow-md ${
                        answers[STEPS[currentStep].id] === option.value
                          ? "border-green-500 bg-green-50 shadow-md"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="text-3xl mb-2">{option.emoji}</div>
                      <div className="font-bold text-gray-800 text-sm">
                        {option.label}
                      </div>
                    </motion.button>
                  ))}
                </div>

                {currentStep > 0 && (
                  <button
                    onClick={handleBack}
                    className="mt-6 text-sm text-gray-400 hover:text-green-600 transition-colors flex items-center gap-1"
                  >
                    ← Go back
                  </button>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Step dots */}
            <div className="flex justify-center gap-2 mt-6">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentStep
                      ? "w-6 bg-green-500"
                      : i < currentStep
                      ? "w-2 bg-green-300"
                      : "w-2 bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* ── LOADING ── */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center"
          >
            <div className="text-7xl animate-bounce mb-6">🌿</div>
            <h2 className="text-2xl font-black text-green-700 mb-3">
              Finding your perfect trip...
            </h2>
            <p className="text-gray-500 mb-6">
              Our AI is analyzing your preferences
            </p>
            <div className="flex justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-green-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* ── RESULT ── */}
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-5"
          >
            {/* Result header */}
            <div className="bg-gradient-to-br from-green-600 to-emerald-500 text-white rounded-3xl p-8 text-center shadow-xl">
              <div className="text-5xl mb-4">🎯</div>
              <h2 className="text-2xl font-black mb-3">
                Your Perfect Agro Trip!
              </h2>
              <p className="text-green-100 leading-relaxed">
                {result.summary}
              </p>
              {result.whyThese && (
                <p className="mt-3 text-green-200 text-sm italic">
                  {result.whyThese}
                </p>
              )}
            </div>

            {/* Destinations */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
              <h3 className="font-black text-gray-800 mb-4 flex items-center gap-2">
                🗺️ Recommended Destinations
              </h3>
              <div className="space-y-3">
                {result.destinations?.map((dest, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-green-50 rounded-xl"
                  >
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-black text-sm flex-shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-gray-800 font-medium">{dest}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Activities */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
              <h3 className="font-black text-gray-800 mb-4">
                🎯 Recommended Activities
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {result.activities?.map((act, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-xl text-sm text-emerald-800 font-medium"
                  >
                    ✓ {act}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                  🗓️ Best Time
                </p>
                <p className="font-bold text-gray-800 text-sm">
                  {result.bestTime}
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                  📦 Suggested Package
                </p>
                <p className="font-bold text-gray-800 text-sm">
                  {result.packages}
                </p>
              </div>
            </div>

            {/* Pro tip */}
            {result.tip && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-2xl p-5">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  💡 Pro Tip
                </p>
                <p className="text-gray-800 font-medium text-sm">
                  {result.tip}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleRestart}
                className="flex-1 py-4 border-2 border-green-600 text-green-600 rounded-2xl font-bold hover:bg-green-50 transition-colors"
              >
                🔄 Start Over
              </button>
              <button
                onClick={() => navigate("/places")}
                className="flex-1 py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold transition-colors"
              >
                🌿 Explore Destinations
              </button>
            </div>
          </motion.div>
        )}

        {/* ===== OTHER AI TOOLS ===== */}
        {!loading && (
          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/chatbot")}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-left hover:shadow-md hover:border-green-200 transition-all group"
            >
              <div className="text-2xl mb-2">🤖</div>
              <p className="font-bold text-gray-800 text-sm group-hover:text-green-700 transition-colors">
                AI Chatbot
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Ask anything about agrotourism and farming
              </p>
            </button>
            <button
              onClick={() => navigate("/disease-detector")}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-left hover:shadow-md hover:border-green-200 transition-all group"
            >
              <div className="text-2xl mb-2">🌿</div>
              <p className="font-bold text-gray-800 text-sm group-hover:text-green-700 transition-colors">
                Disease Detector
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Upload a leaf photo for instant AI diagnosis
              </p>
            </button>
          </div>
        )}
      </div>

      <RecommendFooter />
    </motion.div>
  );
}