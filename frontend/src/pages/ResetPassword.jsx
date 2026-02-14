import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      const userId = localStorage.getItem("resetUserId");

      await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        { userId, newPassword: password }
      );

      alert("Password updated successfully!");
      navigate("/");
    } catch (err) {
      alert("Error resetting password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <form
        onSubmit={handleReset}
        className="bg-white p-8 rounded-xl shadow w-96"
      >
        <h2 className="text-xl font-bold text-center mb-4 text-green-700">
          Set New Password
        </h2>

        <input
          type="password"
          placeholder="New Password"
          className="w-full mb-4 p-3 border rounded"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
          Update Password
        </button>
      </form>
    </div>
  );
}
