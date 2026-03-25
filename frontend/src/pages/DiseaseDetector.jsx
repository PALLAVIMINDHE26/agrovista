import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

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
    { label: "Trip Recommender", to: "/recommendation"   },
    { label: "Disease Detector", to: "/disease-detector" },
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
function DetectorFooter() {
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
              AI-powered plant disease detection helping Indian farmers
              protect their crops and maximize yields through instant
              Gemini AI diagnosis.
            </p>
            <div className="flex flex-wrap gap-2">
              {["🌿 Gemini Vision AI", "⚡ Instant Diagnosis", "🔬 Expert Accuracy"].map(
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
              to="/disease-detector"
              className="hover:text-green-400 transition-colors"
            >
              Disease Detector
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
export default function DiseaseDetector() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError("");
    }
  };

  const handleDetect = async () => {
    if (!image) {
      setError("Please upload a plant image first.");
      return;
    }
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", image);
    try {
      const res = await axios.post(
        "http://localhost:8001/detect-disease",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setResult(res.data);
    } catch (err) {
      setError("Detection failed. Please make sure the AI server is running on port 8001.");
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    if (!severity) return "bg-gray-100 text-gray-700 border-gray-200";
    const s = severity.toLowerCase();
    if (s.includes("low"))    return "bg-green-100 text-green-700 border-green-200";
    if (s.includes("medium")) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    if (s.includes("high"))   return "bg-red-100 text-red-700 border-red-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getSeverityEmoji = (severity) => {
    if (!severity) return "⚪";
    const s = severity.toLowerCase();
    if (s.includes("low"))    return "🟢";
    if (s.includes("medium")) return "🟡";
    if (s.includes("high"))   return "🔴";
    return "⚪";
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
            🌿
          </div>
          <div>
            <p className="text-green-200 text-xs font-bold uppercase tracking-widest mb-1">
              Powered by Google Gemini Vision AI
            </p>
            <h1
              className="text-2xl md:text-3xl font-black"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Plant Disease Detector
            </h1>
            <p className="text-green-100 text-sm mt-1">
              Upload a leaf photo — AI diagnoses diseases and suggests
              treatments instantly
            </p>
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-grow max-w-5xl mx-auto w-full px-4 md:px-6 py-10">

        <div className="grid md:grid-cols-2 gap-8">

          {/* ===== UPLOAD SECTION ===== */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-7 h-7 bg-green-600 rounded-full text-white flex items-center justify-center text-xs font-bold">1</span>
              Upload Plant Image
            </h2>

            {/* Drop zone */}
            <label className="block border-2 border-dashed border-green-300 rounded-2xl p-8 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all duration-200 group">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-52 object-cover rounded-xl"
                />
              ) : (
                <div>
                  <div className="text-6xl mb-3 group-hover:scale-110 transition-transform">
                    🌱
                  </div>
                  <p className="text-gray-600 font-medium">
                    Click to upload or drag & drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG up to 10MB — leaf photos work best
                  </p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {preview && (
              <button
                onClick={() => { setImage(null); setPreview(null); setResult(null); }}
                className="mt-3 text-sm text-red-500 hover:text-red-700 hover:underline transition-colors"
              >
                ✕ Remove image
              </button>
            )}

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleDetect}
              disabled={loading || !image}
              className="mt-6 w-full py-4 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white rounded-2xl font-black transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-base"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Analyzing with AI...
                </span>
              ) : (
                "🔍 Detect Disease"
              )}
            </button>

            {/* Tips */}
            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-2">
                📸 For Best Results
              </p>
              <ul className="space-y-1 text-xs text-amber-800">
                <li>• Take a close-up photo of the affected leaf</li>
                <li>• Ensure good lighting — natural light is ideal</li>
                <li>• Include both healthy and affected areas in frame</li>
                <li>• Avoid blurry or dark images</li>
              </ul>
            </div>
          </div>

          {/* ===== RESULT SECTION ===== */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-7 h-7 bg-green-600 rounded-full text-white flex items-center justify-center text-xs font-bold">2</span>
              Detection Result
            </h2>

            {/* Empty state */}
            {!result && !loading && (
              <div className="text-center py-16">
                <div className="text-7xl mb-4">🔬</div>
                <p className="text-gray-400 font-medium">
                  Upload an image and click detect
                </p>
                <p className="text-gray-300 text-sm mt-1">
                  Results will appear here
                </p>
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div className="text-center py-16">
                <div className="text-6xl animate-bounce mb-4">🌿</div>
                <p className="text-gray-600 font-semibold">
                  AI is analyzing your plant...
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  This usually takes 5–10 seconds
                </p>
              </div>
            )}

            {/* Result */}
            {result && !loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                {/* 1. Plant Name */}
                {result.plant_name && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      🌱 Plant Name
                    </p>
                    <p className="text-xl font-black text-emerald-700">
                      {result.plant_name}
                    </p>
                  </div>
                )}

                {/* 2. Disease Name */}
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    🦠 Detected Disease
                  </p>
                  <p className="text-xl font-black text-green-700">
                    {result.disease || "Unknown"}
                  </p>
                </div>

                {/* 3. Confidence + Severity */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                    <p className="text-xs text-gray-500 mb-1">📊 Confidence</p>
                    <p className="text-xl font-black text-blue-600">
                      {result.confidence}%
                    </p>
                    <div className="mt-2 h-1.5 bg-blue-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-700"
                        style={{ width: `${result.confidence}%` }}
                      />
                    </div>
                  </div>
                  <div
                    className={`p-4 rounded-2xl border ${getSeverityColor(result.severity)}`}
                  >
                    <p className="text-xs opacity-70 mb-1">
                      {getSeverityEmoji(result.severity)} Severity
                    </p>
                    <p className="text-xl font-black">
                      {result.severity || "N/A"}
                    </p>
                  </div>
                </div>

                {/* 4. Description */}
                {result.description && (
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                      📋 Description
                    </p>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {result.description}
                    </p>
                  </div>
                )}

                {/* 5. Treatment */}
                {result.treatment && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-2xl p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                      💊 Recommended Treatment
                    </p>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {result.treatment}
                    </p>
                  </div>
                )}

                {/* Scan again */}
                <button
                  onClick={() => { setResult(null); setPreview(null); setImage(null); }}
                  className="w-full border-2 border-green-200 text-green-700 font-bold py-3 rounded-2xl hover:bg-green-50 transition text-sm"
                >
                  🔄 Scan Another Plant
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* ===== HOW IT WORKS ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-white rounded-3xl border border-gray-100 shadow-sm p-8"
        >
          <h2 className="text-xl font-black text-gray-900 mb-6 text-center">
            🔬 How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "1", icon: "📸", title: "Upload Photo",      desc: "Take a clear photo of the affected plant leaf and upload it" },
              { step: "2", icon: "🤖", title: "AI Analysis",       desc: "Google Gemini Vision AI analyzes the image for disease patterns" },
              { step: "3", icon: "💊", title: "Get Treatment",     desc: "Receive disease name, severity level and treatment recommendations" },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-black text-lg mx-auto mb-3 shadow-md">
                  {item.step}
                </div>
                <div className="text-3xl mb-2">{item.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ===== OTHER AI TOOLS ===== */}
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
              Ask questions about farming, destinations and more
            </p>
          </button>
          <button
            onClick={() => navigate("/recommendation")}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-left hover:shadow-md hover:border-green-200 transition-all group"
          >
            <div className="text-2xl mb-2">🧠</div>
            <p className="font-bold text-gray-800 text-sm group-hover:text-green-700 transition-colors">
              Trip Recommender
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Get personalized agrotourism recommendations
            </p>
          </button>
        </div>
      </div>

      <DetectorFooter />
    </motion.div>
  );
}