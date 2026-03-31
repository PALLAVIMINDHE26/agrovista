import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function ResetPassword() {
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [showPass, setShowPass]   = useState(false);
  const [showConf, setShowConf]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState(false);
  const navigate = useNavigate();

  /* ---- Password strength ---- */
  const getStrength = () => {
    if (!password) return { level: 0, label: "", color: "", bg: "" };
    if (password.length < 6)
      return { level: 1, label: "Weak",   color: "bg-red-500",   bg: "text-red-600"   };
    if (password.length < 10)
      return { level: 2, label: "Medium", color: "bg-amber-500", bg: "text-amber-600" };
    return   { level: 3, label: "Strong", color: "bg-green-500", bg: "text-green-600" };
  };
  const strength  = getStrength();
  const matches   = password && confirm && password === confirm;
  const mismatch  = confirm && password !== confirm;

  /* ---- Submit (existing logic preserved) ---- */
  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const userId = localStorage.getItem("resetUserId");
      await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        { userId, newPassword: password }
      );
      setSuccess(true);
      localStorage.removeItem("resetUserId");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* ===== LEFT PANEL ===== */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=85"
          alt="Farm"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-indigo-800/60 to-teal-900/70" />

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
              <div className="text-6xl mb-6">🛡️</div>
              <h2
                className="text-4xl font-black text-white mb-4 leading-tight"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Set Your New
                <span className="block text-blue-300">Password</span>
              </h2>
              <p className="text-blue-100 text-lg leading-relaxed mb-6">
                Create a strong password to secure your AgroVista account
                and keep your bookings safe.
              </p>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5">
                <p className="text-blue-100 text-sm font-bold mb-3">
                  Strong password tips:
                </p>
                <ul className="space-y-2 text-blue-200 text-sm">
                  <li>• At least 8 characters long</li>
                  <li>• Mix of letters and numbers</li>
                  <li>• Include a special character</li>
                  <li>• Don't use personal information</li>
                </ul>
              </div>
            </motion.div>
          </div>

          <p className="text-blue-200 text-sm">
            © 2026 AgroVista. Your security is our top priority.
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
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-xl">
                  ✅
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-3">
                  Password Updated!
                </h2>
                <p className="text-gray-500 mb-6">
                  Your password has been successfully reset.
                  Redirecting to login...
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

          {!success && (
            <>
              {/* Icon */}
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-md">
                🛡️
              </div>

              {/* Header */}
              <div className="mb-8">
                <h1
                  className="text-3xl font-black text-gray-900 mb-2"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  Create new password
                </h1>
                <p className="text-gray-500">
                  Your new password must be different from your previous one.
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

              <form onSubmit={handleReset} className="space-y-5">

                {/* New password */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      🔒
                    </span>
                    <input
                      type={showPass ? "text" : "password"}
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-11 pr-12 py-3.5 border-2 border-gray-200 rounded-2xl text-gray-800 focus:outline-none focus:border-blue-400 transition-colors placeholder-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                    >
                      {showPass ? "🙈" : "👁️"}
                    </button>
                  </div>

                  {/* Strength meter */}
                  {password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3].map((level) => (
                          <div
                            key={level}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                              strength.level >= level ? strength.color : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <p className={`text-xs font-medium ${strength.bg}`}>
                        {strength.label} password
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      🔒
                    </span>
                    <input
                      type={showConf ? "text" : "password"}
                      placeholder="Confirm your new password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                      className={`w-full pl-11 pr-12 py-3.5 border-2 rounded-2xl text-gray-800 focus:outline-none transition-colors placeholder-gray-400 ${
                        matches
                          ? "border-green-400 bg-green-50/30"
                          : mismatch
                          ? "border-red-400 bg-red-50/30"
                          : "border-gray-200 focus:border-blue-400"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConf(!showConf)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                    >
                      {showConf ? "🙈" : "👁️"}
                    </button>
                    {matches && (
                      <span className="absolute right-10 top-1/2 -translate-y-1/2 text-green-500">
                        ✓
                      </span>
                    )}
                  </div>
                  {mismatch && (
                    <p className="text-red-500 text-xs mt-1.5 ml-1">
                      Passwords do not match
                    </p>
                  )}
                  {matches && (
                    <p className="text-green-600 text-xs mt-1.5 ml-1">
                      ✓ Passwords match
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || mismatch || !password || !confirm}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white font-black py-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-base"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                        <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Updating password...
                    </span>
                  ) : (
                    "Reset Password 🛡️"
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