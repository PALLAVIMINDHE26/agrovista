import { useState } from "react";
import axios from "axios";

export default function OtpVerify() {
  const [otp, setOtp] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const userId = localStorage.getItem("userId");

      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        { userId, otp }
      );

      localStorage.setItem("token", res.data.token);
      alert("Login successful!");
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300">
      <form className="bg-white p-8 rounded-xl shadow-xl w-96">
        <h2 className="text-xl font-bold text-center text-green-700 mb-4">
          OTP Verification
        </h2>

        <input
          placeholder="Enter OTP"
          className="w-full mb-4 p-3 border rounded text-center tracking-widest"
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
          Verify OTP
        </button>
      </form>
    </div>
  );
}
