import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { jwtDecode } from "jwt-decode";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Added for OTP-based login
  const [step, setStep] = useState(1); // 1: login, 2: otp
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState(null);
  const [otpLoading, setOtpLoading] = useState(false);

//   const decoded = jwtDecode(res.data.token);
//   console.log(decoded);

// if (decoded.role === "admin") {
//   navigate("/admin-dashboard");
// } else {
//   navigate("/user-dashboard");
// }

  // Modified: handle login to support OTP step
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );
      // If login is successful, backend sends userId and message (no token)
      setUserId(res.data.userId); // Save userId for OTP verification
      setStep(2); // Move to OTP step
      alert(res.data.message || "OTP sent to your email");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Added: handle OTP verification
  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setOtpLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        {
          userId,
          otp,
        }
      );
      // Save token
      localStorage.setItem("token", res.data.token);
      // Decode token
      const decoded = jwtDecode(res.data.token);
      console.log("Decoded Token:", decoded);
      // Navigate based on role
      if (decoded.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed");
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.5 }}
    >
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300">
        {/* Step 1: Email/Password Login */}
        {step === 1 && (
          <form
            onSubmit={handleLogin}
            className="bg-white p-8 rounded-xl shadow-xl w-96 animate-fade-in"
          >
            <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
              AgroVista Login
            </h2>

            <input
              type="email"
              placeholder="Email"
              className="w-full mb-4 p-3 border rounded focus:ring-2 focus:ring-green-400"
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full mb-4 p-3 border rounded focus:ring-2 focus:ring-green-400"
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <p className="text-right text-sm mb-4">
              <Link to="/forgot-password" className="text-green-600 hover:underline">
                Forgot Password?
              </Link>
            </p>

            <button
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >
              {loading ? "Sending OTP..." : "Login"}
            </button>

            <p className="text-sm text-center mt-4">
              New user?{" "}
              <Link to="/signup" className="text-green-600 font-semibold">
                Sign up
              </Link>
            </p>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <form
            onSubmit={handleOtpVerify}
            className="bg-white p-8 rounded-xl shadow-xl w-96 animate-fade-in"
          >
            <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
              Enter OTP
            </h2>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full mb-4 p-3 border rounded focus:ring-2 focus:ring-green-400"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength={6}
            />
            <button
              disabled={otpLoading}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >
              {otpLoading ? "Verifying..." : "Verify OTP"}
            </button>
            <p className="text-sm text-center mt-4">
              <button
                type="button"
                className="text-green-600 hover:underline"
                onClick={() => setStep(1)}
              >
                Go back to Login
              </button>
            </p>
          </form>
        )}
      </div>
    </motion.div>
  );
}
