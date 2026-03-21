import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "../layouts/MainLayout";

const STEPS = [
  {
    id: "groupType",
    question: "Who are you travelling with?",
    emoji: "👥",
    options: [
      { label: "Solo", emoji: "🧍", value: "solo" },
      { label: "Couple", emoji: "👫", value: "couple" },
      { label: "Family", emoji: "👨‍👩‍👧‍👦", value: "family" },
      { label: "Friends", emoji: "🎉", value: "friends" },
    ],
  },
  {
    id: "budget",
    question: "What is your budget per person?",
    emoji: "💰",
    options: [
      { label: "Budget (< ₹1,000)", emoji: "🪙", value: "budget under 1000" },
      { label: "Mid (₹1,000–₹5,000)", emoji: "💵", value: "mid range 1000 to 5000" },
      { label: "Premium (₹5,000+)", emoji: "💎", value: "premium above 5000" },
      { label: "No Limit", emoji: "🤑", value: "no budget limit" },
    ],
  },
  {
    id: "duration",
    question: "How long is your trip?",
    emoji: "⏳",
    options: [
      { label: "Day Trip", emoji: "🌅", value: "1 day" },
      { label: "Weekend", emoji: "🏕️", value: "2-3 days" },
      { label: "Week", emoji: "📅", value: "5-7 days" },
      { label: "Extended", emoji: "✈️", value: "more than a week" },
    ],
  },
  {
    id: "interest",
    question: "What are you most interested in?",
    emoji: "🎯",
    options: [
      { label: "Farming & Nature", emoji: "🌾", value: "farming and nature" },
      { label: "Culture & Festivals", emoji: "🎉", value: "culture and festivals" },
      { label: "Adventure", emoji: "🧗", value: "adventure and trekking" },
      { label: "Relaxation", emoji: "🧘", value: "relaxation and wellness" },
    ],
  },
  {
    id: "season",
    question: "Which season are you planning to visit?",
    emoji: "🌤️",
    options: [
      { label: "Winter (Oct–Feb)", emoji: "❄️", value: "winter" },
      { label: "Summer (Mar–Jun)", emoji: "☀️", value: "summer" },
      { label: "Monsoon (Jul–Sep)", emoji: "🌧️", value: "monsoon" },
      { label: "Any Season", emoji: "🗓️", value: "any season" },
    ],
  },
  {
    id: "state",
    question: "Any preferred state in India?",
    emoji: "🗺️",
    options: [
      { label: "Kerala", emoji: "🌴", value: "Kerala" },
      { label: "Punjab", emoji: "🌾", value: "Punjab" },
      { label: "Rajasthan", emoji: "🏜️", value: "Rajasthan" },
      { label: "No Preference", emoji: "🇮🇳", value: "any state in India" },
    ],
  },
];

export default function Recommendation() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState(1);

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

  const progress = ((currentStep) / STEPS.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.5 }}
    >
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-100 p-6 md:p-10">

          {/* HEADER */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-green-700 mb-2">
              🧠 AI Trip Recommender
            </h1>
            <p className="text-gray-600">
              Answer a few questions and get your perfect agrotourism experience
            </p>
          </div>

          {/* QUIZ / RESULT AREA */}
          <div className="max-w-2xl mx-auto">

            {!result && !loading && (
              <>
                {/* PROGRESS BAR */}
                <div className="mb-8">
                  <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>Step {currentStep + 1} of {STEPS.length}</span>
                    <span>{Math.round(progress)}% complete</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-3 bg-green-500 rounded-full"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>

                {/* QUESTION CARD */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: direction * 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction * -60 }}
                    transition={{ duration: 0.35 }}
                    className="bg-white rounded-3xl shadow-xl p-8"
                  >
                    <div className="text-center mb-8">
                      <div className="text-6xl mb-4">
                        {STEPS[currentStep].emoji}
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        {STEPS[currentStep].question}
                      </h2>
                    </div>

                    {/* OPTIONS */}
                    <div className="grid grid-cols-2 gap-4">
                      {STEPS[currentStep].options.map((option) => (
                        <motion.button
                          key={option.value}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleSelect(option.value)}
                          className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 hover:border-green-500 hover:bg-green-50 hover:shadow-md ${
                            answers[STEPS[currentStep].id] === option.value
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200"
                          }`}
                        >
                          <div className="text-3xl mb-2">{option.emoji}</div>
                          <div className="font-semibold text-gray-800">
                            {option.label}
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    {/* BACK BUTTON */}
                    {currentStep > 0 && (
                      <button
                        onClick={handleBack}
                        className="mt-6 text-sm text-gray-400 hover:text-green-600 transition flex items-center gap-1"
                      >
                        ← Go back
                      </button>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* STEP INDICATORS */}
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

            {/* LOADING */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-3xl shadow-xl p-12 text-center"
              >
                <div className="text-7xl animate-bounce mb-6">🌿</div>
                <h2 className="text-2xl font-bold text-green-700 mb-3">
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

            {/* RESULT */}
            {result && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Result Header */}
                <div className="bg-green-600 text-white rounded-3xl p-8 text-center shadow-xl">
                  <div className="text-5xl mb-4">🎯</div>
                  <h2 className="text-2xl font-bold mb-3">
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
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
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
                        <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {i + 1}
                        </div>
                        <span className="text-gray-800 font-medium">
                          {dest}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Activities */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    🎯 Recommended Activities
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {result.activities?.map((act, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-xl text-sm text-emerald-800 font-medium"
                      >
                        ✓ {act}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                      🗓️ Best Time to Visit
                    </p>
                    <p className="font-semibold text-gray-800">
                      {result.bestTime}
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                      📦 Suggested Package
                    </p>
                    <p className="font-semibold text-gray-800">
                      {result.packages}
                    </p>
                  </div>
                </div>

                {/* Tip */}
                {result.tip && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-2xl p-6">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                      💡 Pro Tip
                    </p>
                    <p className="text-gray-800 font-medium">
                      {result.tip}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handleRestart}
                    className="flex-1 py-4 border-2 border-green-600 text-green-600 rounded-2xl font-semibold hover:bg-green-50 transition"
                  >
                    🔄 Start Over
                  </button>
                  <button
                    onClick={() => window.location.href = "/places"}
                    className="flex-1 py-4 bg-green-600 text-white rounded-2xl font-semibold hover:bg-green-700 transition"
                  >
                    🌿 Explore Destinations
                  </button>
                </div>

              </motion.div>
            )}
          </div>
        </div>
      </MainLayout>
    </motion.div>
  );
}