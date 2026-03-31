import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function OtpVerify() {
  const [otp, setOtp]         = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  /* ---- Countdown timer ---- */
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  /* ---- Handle digit input ---- */
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // digits only
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // keep last digit
    setOtp(newOtp);
    setError("");

    // Auto-focus next
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /* ---- Handle backspace ---- */
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  /* ---- Handle paste ---- */
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
      const userId = localStorage.getItem("userId");
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        { userId, otp: otpString }
      );

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        const decoded = JSON.parse(atob(res.data.token.split(".")[1]));
        window.dispatchEvent(new Event("storage"));

        if (decoded.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP. Please try again.");
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
          src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&q=85"
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
              <div className="text-6xl mb-6">🔐</div>
              <h2
                className="text-4xl font-black text-white mb-4 leading-tight"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Secure Login
                <span className="block text-green-300">Verification</span>
              </h2>
              <p className="text-green-100 text-lg leading-relaxed mb-6">
                We sent a 6-digit OTP to your registered email address.
                Enter it to complete your secure login.
              </p>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 space-y-3">
                {[
                  "🔒 OTP valid for 5 minutes only",
                  "📧 Check your spam folder too",
                  "🔄 Request new OTP if expired",
                ].map((tip, i) => (
                  <p key={i} className="text-green-100 text-sm flex items-center gap-2">
                    <span>{tip}</span>
                  </p>
                ))}
              </div>
            </motion.div>
          </div>

          <p className="text-green-200 text-sm">
            © 2026 AgroVista. Secure login powered by OTP verification.
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
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden text-xl font-black text-green-700 flex items-center gap-2 mb-8">
            AgroVista 🌿
          </Link>

          {/* Icon */}
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-md">
            📧
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1
              className="text-3xl font-black text-gray-900 mb-2"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Check your email
            </h1>
            <p className="text-gray-500">
              We sent a 6-digit verification code to your email address.
              Enter it below to sign in.
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

          {/* OTP form */}
          <form onSubmit={handleVerify}>

            {/* OTP digit inputs */}
            <div className="flex gap-3 justify-center mb-8" onPaste={handlePaste}>
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
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-200 bg-white text-gray-900 focus:border-green-400"
                  }`}
                />
              ))}
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mb-6">
              {otp.map((digit, i) => (
                <div
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full transition-all duration-200 ${
                    digit ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !otpComplete}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-black py-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-base mb-4"
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
                "Verify & Sign In ✓"
              )}
            </button>
          </form>

          {/* Resend */}
          <div className="text-center">
            {canResend ? (
              <button
                onClick={async () => {
                  setResending(true);
                  try {
                    const userId = localStorage.getItem("userId");
                    // Re-trigger login to resend OTP
                    alert("Please go back and login again to resend OTP.");
                  } finally {
                    setResending(false);
                    setCountdown(60);
                    setCanResend(false);
                  }
                }}
                className="text-green-600 font-bold hover:underline text-sm"
              >
                {resending ? "Sending..." : "Resend OTP"}
              </button>
            ) : (
              <p className="text-gray-400 text-sm">
                Resend OTP in{" "}
                <span className="text-green-600 font-bold">{countdown}s</span>
              </p>
            )}
          </div>

          {/* Back to login */}
          <div className="text-center mt-6 pt-6 border-t border-gray-100">
            <Link
              to="/login"
              className="text-gray-500 hover:text-green-600 text-sm font-medium transition-colors"
            >
              ← Back to Login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}