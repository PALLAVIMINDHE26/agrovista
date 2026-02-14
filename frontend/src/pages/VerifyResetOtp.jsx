import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function VerifyResetOtp() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const userId = localStorage.getItem("resetUserId");

      await axios.post(
        "http://localhost:5000/api/auth/verify-reset-otp",
        { userId, otp }
      );

      navigate("/reset-password");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <form
        onSubmit={handleVerify}
        className="bg-white p-8 rounded-xl shadow w-96"
      >
        <h2 className="text-xl font-bold text-center mb-4 text-green-700">
          Verify OTP
        </h2>

        <input
          placeholder="Enter OTP"
          className="w-full mb-4 p-3 border rounded text-center"
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
          Verify
        </button>
      </form>
    </div>
  );
}
