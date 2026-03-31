import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function VerifyResetOtp() {
  const [otp, setOtp]         = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [countdown, setCountdown] = useState(300); // 5 mins
  const inputRefs = useRef([]);
  const navigate  = useNavigate();

  /* ---- Countdown ---- */
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  /* ---- Handle digit input ---- */
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    pasted.split("").forEach((digit, i) => {
      if (i < 6) newOtp[i] = digit;
    });
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  /* ---- Submit (existing logic preserved) ---- */
  const handleVerify = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length < 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const userId = localStorage.getItem("resetUserId");
      await axios.post(
        "http://localhost:5000/api/auth/verify-reset-otp",
        { userId, otp: otpString }
      );
      navigate("/reset-password");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const otpComplete = otp.every(d => d !== "");

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* ===== LEFT PANEL ===== */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1200&q=85"
          alt="Farm"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/80 via-orange-800/60 to-red-900/70" />

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
              <div className="text-6xl mb-6">🔑</div>
              <h2
                className="text-4xl font-black text-white mb-4 leading-tight"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Password Reset
                <span className="block text-amber-300">Verification</span>
              </h2>
              <p className="text-orange-100 text-lg leading-relaxed mb-6">
                We sent a password reset code to your email.
                This code is valid for 5 minutes only.
              </p>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5">
                <p className="text-orange-100 text-sm font-bold mb-3">Security Tips:</p>
                <ul className="space-y-2 text-orange-200 text-sm">
                  <li>• Never share this OTP with anyone</li>
                  <li>• AgroVista will never ask for your OTP</li>
                  <li>• Code expires in 5 minutes</li>
                </ul>
              </div>
            </motion.div>
          </div>

          <p className="text-orange-200 text-sm">
            © 2026 AgroVista. Your account security is our priority.
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

          {/* Icon */}
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-md">
            🔑
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1
              className="text-3xl font-black text-gray-900 mb-2"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Verify your identity
            </h1>
            <p className="text-gray-500">
              Enter the 6-digit code we sent to your email to reset your password.
            </p>
          </div>

          {/* Timer */}
          <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl mb-6 ${
            countdown > 60
              ? "bg-green-50 border border-green-200"
              : countdown > 0
              ? "bg-amber-50 border border-amber-200"
              : "bg-red-50 border border-red-200"
          }`}>
            <span className="text-xl">⏱️</span>
            <div>
              <p className={`text-sm font-bold ${
                countdown > 60 ? "text-green-700" :
                countdown > 0  ? "text-amber-700" :
                "text-red-700"
              }`}>
                {countdown > 0
                  ? `OTP expires in ${formatTime(countdown)}`
                  : "OTP has expired — request a new one"}
              </p>
            </div>
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

          <form onSubmit={handleVerify}>
            {/* OTP inputs */}
            <div className="flex gap-3 justify-center mb-6" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <motion.input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`w-12 h-14 text-center text-2xl font-black border-2 rounded-2xl focus:outline-none transition-all duration-200 ${
                    digit
                      ? "border-amber-500 bg-amber-50 text-amber-700"
                      : "border-gray-200 bg-white text-gray-900 focus:border-amber-400"
                  }`}
                />
              ))}
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mb-6">
              {otp.map((digit, i) => (
                <div
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full transition-all ${
                    digit ? "bg-amber-500" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || !otpComplete || countdown === 0}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black py-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-base mb-4"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Verifying...
                </span>
              ) : (
                "Verify OTP →"
              )}
            </button>
          </form>

          <div className="text-center space-y-3">
            <button
              onClick={() => navigate("/forgot-password")}
              className="text-amber-600 hover:underline text-sm font-medium"
            >
              Resend OTP
            </button>
            <div className="border-t border-gray-100 pt-3">
              <Link to="/login" className="text-gray-500 hover:text-green-600 text-sm transition-colors">
                ← Back to Login
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}