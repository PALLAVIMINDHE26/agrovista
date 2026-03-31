import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/* ============================================================
   MAIN SIGNUP PAGE — existing logic 100% preserved
============================================================ */
export default function Signup() {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const navigate = useNavigate();

  /* ---- Existing signup handler preserved exactly ---- */
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        email,
        password,
      });
      alert("Signup successful! Please login.");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ---- Google signup handler ---- */
  const handleGoogleSignup = () => {
    // TODO: Wire to Google OAuth
    // window.location.href = "http://localhost:5000/api/auth/google";
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  /* ---- Password strength ---- */
  const getPasswordStrength = () => {
    if (!password) return { level: 0, label: "", color: "" };
    if (password.length < 6)  return { level: 1, label: "Weak",   color: "bg-red-500"    };
    if (password.length < 10) return { level: 2, label: "Medium", color: "bg-amber-500"  };
    return                           { level: 3, label: "Strong", color: "bg-green-500"  };
  };
  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* ===== LEFT PANEL ===== */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1200&q=85"
          alt="Farm"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/85 via-green-800/65 to-teal-900/75" />

        {/* Floating elements */}
        {["🌾", "🥕", "🍅", "🌱"].map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl opacity-25"
            style={{ left: `${12 + i * 24}%`, top: `${25 + (i % 3) * 22}%` }}
            animate={{ y: [-8, 12, -8], rotate: [-8, 8, -8] }}
            transition={{ duration: 3.5 + i * 0.6, repeat: Infinity, delay: i * 0.8 }}
          >
            {emoji}
          </motion.div>
        ))}

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link to="/" className="text-2xl font-black text-white">
            AgroVista 🌿
          </Link>

          {/* Center */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2
                className="text-4xl font-black text-white mb-4 leading-tight"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Join India's Largest
                <span className="block text-green-300">
                  Agrotourism Community
                </span>
              </h2>
              <p className="text-green-100 text-lg leading-relaxed mb-8">
                Free to join. Instant access to 50+ farm destinations,
                AI tools and exclusive booking deals.
              </p>

              {/* Benefits */}
              <div className="space-y-3">
                {[
                  { icon: "🌾", text: "Access 50+ verified agrotourism destinations" },
                  { icon: "🤖", text: "Free AI chatbot, disease detector & recommender" },
                  { icon: "📄", text: "Instant booking confirmation & PDF invoices" },
                  { icon: "🎯", text: "Personalized farm activity recommendations" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center text-base flex-shrink-0">
                      {item.icon}
                    </div>
                    <span className="text-green-100 text-sm">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: "50+",    label: "Destinations" },
              { value: "1,200+", label: "Happy Visitors" },
              { value: "4.8★",   label: "Avg Rating" },
            ].map((s, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center"
              >
                <p className="text-2xl font-black text-white">{s.value}</p>
                <p className="text-green-200 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== RIGHT PANEL — form ===== */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <Link
            to="/"
            className="lg:hidden text-xl font-black text-green-700 flex items-center gap-2 mb-8"
          >
            AgroVista 🌿
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1
              className="text-3xl font-black text-gray-900 mb-2"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Create your account ✨
            </h1>
            <p className="text-gray-500">
              Free forever · No credit card required
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 font-medium px-4 py-3 rounded-2xl mb-6 flex items-center gap-2 text-sm"
            >
              <span>⚠️</span> {error}
            </motion.div>
          )}

          {/* ---- GOOGLE SIGNUP ---- */}
          <button
            onClick={handleGoogleSignup}
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-bold py-3.5 rounded-2xl transition-all hover:shadow-md mb-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-xs font-medium">
              or sign up with email
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* ---- SIGNUP FORM (existing logic) ---- */}
          <form onSubmit={handleSignup} className="space-y-4">

            {/* Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  👤
                </span>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-2xl text-gray-800 focus:outline-none focus:border-green-400 transition-colors placeholder-gray-400"
                />
              </div>
            </div>

            {/* Email */}
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
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-2xl text-gray-800 focus:outline-none focus:border-green-400 transition-colors placeholder-gray-400"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  🔒
                </span>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-12 py-3.5 border-2 border-gray-200 rounded-2xl text-gray-800 focus:outline-none focus:border-green-400 transition-colors placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>

              {/* Password strength meter */}
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          strength.level >= level
                            ? strength.color
                            : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  {strength.label && (
                    <p className={`text-xs font-medium ${
                      strength.level === 1 ? "text-red-500" :
                      strength.level === 2 ? "text-amber-500" :
                      "text-green-500"
                    }`}>
                      {strength.label} password
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Terms */}
            <p className="text-xs text-gray-400 leading-relaxed">
              By creating an account you agree to our{" "}
              <Link to="/" className="text-green-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/" className="text-green-600 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>

            {/* Submit */}
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
                  Creating account...
                </span>
              ) : (
                "Create Free Account 🌿"
              )}
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-green-600 font-bold hover:underline"
            >
              Sign in
            </Link>
          </p>

          {/* Trust */}
          <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-gray-100">
            {["🔒 SSL Secure", "✅ Free Forever", "🌿 No Spam"].map((b, i) => (
              <span key={i} className="text-xs text-gray-400">{b}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}