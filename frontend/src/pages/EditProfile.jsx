import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  ],
  "AI Tools": [
    { label: "AI Chatbot",       to: "/chatbot"          },
    { label: "Disease Detector", to: "/disease-detector" },
    { label: "Recommender",      to: "/recommendation"   },
  ],
  Account: [
    { label: "My Dashboard",     to: "/dashboard"        },
    { label: "Admin Panel",      to: "/admin-dashboard"  },
    { label: "Login",            to: "/login"            },
  ],
};

/* ============================================================
   FOOTER
============================================================ */
function EditProfileFooter() {
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
              Manage your AgroVista profile and preferences. Your data
              is secure and never shared with third parties.
            </p>
            <div className="flex flex-wrap gap-2">
              {["🔒 SSL Secure", "✅ Verified", "🌿 AgroVista"].map((b, i) => (
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
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <span>© 2026 AgroVista. Made with 🌿 for Rural India.</span>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-green-400 transition-colors">Privacy Policy</Link>
            <Link to="/" className="hover:text-green-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   MAIN COMPONENT — all existing logic preserved
============================================================ */
export default function EditProfile() {
  const navigate = useNavigate();

  /* ---- Decode token (existing logic) ---- */
  const token = localStorage.getItem("token");
  let userId = null;
  if (token) {
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      userId = decoded.userId;
    } catch (error) {
      console.log("Token decode failed:", error);
    }
  }

  const [formData, setFormData] = useState({ name: "", email: "" });
  const [message, setMessage]   = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [touched, setTouched]   = useState({});

  /* ---- Fetch profile (existing logic) ---- */
  useEffect(() => {
    if (!userId) return;
    axios
      .get(`http://localhost:5000/api/users/${userId}`)
      .then((res) => {
        setFormData({
          name:  res.data.name  || "",
          email: res.data.email || "",
        });
      })
      .catch((err) => console.error("Profile fetch error:", err));
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setTouched({ ...touched, [e.target.name]: true });
  };

  /* ---- Submit (existing logic) ---- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;
    setLoading(true);
    setError("");
    try {
      await axios.put(
        `http://localhost:5000/api/users/${userId}`,
        formData
      );
      setMessage("Profile updated successfully ✅");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      console.error("Update error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---- Avatar letter ---- */
  const avatarLetter = formData.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col min-h-screen bg-gray-50"
    >
      <Navbar />

      {/* ===== HERO STRIP ===== */}
      <div className="mt-16 bg-gradient-to-r from-green-800 via-emerald-700 to-teal-700 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="max-w-4xl mx-auto px-6 py-8 flex items-center gap-5">
          <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl font-black border border-white/20 flex-shrink-0 shadow-xl">
            {avatarLetter}
          </div>
          <div>
            <p className="text-green-200 text-xs font-bold uppercase tracking-widest mb-1">
              Account Settings
            </p>
            <h1
              className="text-2xl md:text-3xl font-black"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Edit Profile
            </h1>
            <p className="text-green-100 text-sm mt-1">
              Update your name and email address
            </p>
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-grow max-w-4xl mx-auto w-full px-4 md:px-6 py-10">
        <div className="grid md:grid-cols-3 gap-8">

          {/* ===== LEFT — Avatar card ===== */}
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 text-center sticky top-24"
            >
              {/* Avatar */}
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center text-4xl font-black text-white mx-auto mb-4 shadow-xl">
                {avatarLetter}
              </div>
              <h3 className="font-black text-gray-900 text-lg">
                {formData.name || "Your Name"}
              </h3>
              <p className="text-gray-500 text-sm mt-1 break-all">
                {formData.email || "your@email.com"}
              </p>

              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Account Type</span>
                  <span className="bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-xs font-bold capitalize">
                    User
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Status</span>
                  <span className="bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    Active
                  </span>
                </div>
              </div>

              {/* Quick links */}
              <div className="mt-5 pt-4 border-t border-gray-100 space-y-2">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full text-left text-sm text-gray-600 hover:text-green-700 transition-colors flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-green-50"
                >
                  <span>📋</span> My Dashboard
                </button>
                <button
                  onClick={() => navigate("/places")}
                  className="w-full text-left text-sm text-gray-600 hover:text-green-700 transition-colors flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-green-50"
                >
                  <span>🌾</span> Explore Destinations
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/login");
                  }}
                  className="w-full text-left text-sm text-red-500 hover:text-red-700 transition-colors flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-50"
                >
                  <span>🚪</span> Sign Out
                </button>
              </div>
            </motion.div>
          </div>

          {/* ===== RIGHT — Form ===== */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Form header */}
              <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="font-black text-gray-900 text-lg">
                  Personal Information
                </h2>
                <p className="text-gray-500 text-sm mt-0.5">
                  Update your name and email address below
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">

                {/* Success message */}
                <AnimatePresence>
                  {message && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-green-50 border border-green-200 text-green-700 font-semibold px-5 py-3 rounded-2xl flex items-center gap-2"
                    >
                      <span>✅</span> {message}
                    </motion.div>
                  )}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-red-50 border border-red-200 text-red-700 font-semibold px-5 py-3 rounded-2xl flex items-center gap-2"
                    >
                      <span>⚠️</span> {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Name field */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                      👤
                    </span>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                      className={`w-full pl-11 pr-4 py-3.5 border-2 rounded-2xl text-gray-800 focus:outline-none transition-all duration-200 ${
                        touched.name && formData.name
                          ? "border-green-400 bg-green-50/30"
                          : "border-gray-200 focus:border-green-400 bg-white"
                      }`}
                    />
                    {touched.name && formData.name && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5 ml-1">
                    This name will appear on your bookings and invoices
                  </p>
                </div>

                {/* Email field */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                      📧
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      required
                      className={`w-full pl-11 pr-4 py-3.5 border-2 rounded-2xl text-gray-800 focus:outline-none transition-all duration-200 ${
                        touched.email && formData.email
                          ? "border-green-400 bg-green-50/30"
                          : "border-gray-200 focus:border-green-400 bg-white"
                      }`}
                    />
                    {touched.email && formData.email && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5 ml-1">
                    OTPs and booking confirmations are sent to this email
                  </p>
                </div>

                {/* Info box */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                  <span className="text-amber-500 text-lg flex-shrink-0">💡</span>
                  <div>
                    <p className="text-amber-800 text-sm font-semibold">
                      Password Change
                    </p>
                    <p className="text-amber-700 text-xs mt-0.5">
                      To change your password, use the Forgot Password
                      option on the login page. We send a secure OTP to
                      your email.
                    </p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className="flex-1 py-3.5 border-2 border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3.5 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-black rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                          <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      "Save Changes ✓"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      <EditProfileFooter />
    </motion.div>
  );
}