import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function ForgotPassword() {
  const [email, setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const [sent, setSent]     = useState(false);
  const navigate = useNavigate();

  /* ---- Submit (existing logic preserved) ---- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );
      localStorage.setItem("resetUserId", res.data.userId);
      setSent(true);
      setTimeout(() => navigate("/verify-reset-otp"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Email not found. Please check and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* ===== LEFT PANEL ===== */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=85"
          alt="Farm"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 via-emerald-800/60 to-teal-900/70" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="text-2xl font-black text-white">
            AgroVista 🌿
          </Link>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-6xl mb-6">🔓</div>
              <h2
                className="text-4xl font-black text-white mb-4 leading-tight"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Forgot Your
                <span className="block text-green-300">Password?</span>
              </h2>
              <p className="text-green-100 text-lg leading-relaxed mb-6">
                No worries! Enter your registered email and we'll send you
                a secure OTP to reset your password.
              </p>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 space-y-3">
                {[
                  "📧 Enter your registered email",
                  "🔢 Receive a 6-digit OTP",
                  "🔒 Set your new password",
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-green-100 text-sm">{step}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <p className="text-green-200 text-sm">
            © 2026 AgroVista. Secure account recovery.
          </p>
        </div>
      </div>

      {/* ===== RIGHT PANEL ===== */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="lg:hidden text-xl font-black text-green-700 flex items-center gap-2 mb-8">
            AgroVista 🌿
          </Link>

          {/* Success state */}
          <AnimatePresence>
            {sent && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-xl">
                  📧
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-3">
                  OTP Sent!
                </h2>
                <p className="text-gray-500 mb-6">
                  Check your email for the reset code.
                  Redirecting to verification...
                </p>
                <div className="flex justify-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!sent && (
            <>
              {/* Icon */}
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-md">
                🔓
              </div>

              {/* Header */}
              <div className="mb-8">
                <h1
                  className="text-3xl font-black text-gray-900 mb-2"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  Forgot password?
                </h1>
                <p className="text-gray-500">
                  Enter your registered email address and we'll send you
                  a 6-digit OTP to reset your password.
                </p>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-red-50 border border-red-200 text-red-700 font-medium px-4 py-3 rounded-2xl mb-6 flex items-center gap-2 text-sm"
                  >
                    <span>⚠️</span> {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      📧
                    </span>
                    <input
                      type="email"
                      placeholder="Enter your registered email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-2xl text-gray-800 focus:outline-none focus:border-green-400 transition-colors placeholder-gray-400"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5 ml-1">
                    We'll send a 6-digit OTP to this email
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-black py-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 text-base"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                        <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Sending OTP...
                    </span>
                  ) : (
                    "Send OTP →"
                  )}
                </button>
              </form>

              <div className="text-center mt-6 pt-6 border-t border-gray-100">
                <Link
                  to="/login"
                  className="text-gray-500 hover:text-green-600 text-sm font-medium transition-colors"
                >
                  ← Back to Login
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}