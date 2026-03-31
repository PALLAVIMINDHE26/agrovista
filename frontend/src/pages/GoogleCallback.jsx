import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function GoogleCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    const error = params.get("error");

    if (error) {
      navigate("/login?error=google_failed");
      return;
    }

    if (token) {
      try {
        localStorage.setItem("token", token);
        const decoded = jwtDecode(token);
        
        // Trigger navbar update
        window.dispatchEvent(new Event("storage"));

        // Navigate based on role
        if (decoded.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      } catch (err) {
        console.error("Token decode error:", err);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center bg-white rounded-3xl p-12 shadow-2xl max-w-sm w-full mx-4"
      >
        <div className="text-6xl animate-bounce mb-6">🌿</div>
        <h2 className="text-xl font-black text-gray-900 mb-2">
          Signing you in...
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Please wait while we set up your account
        </p>
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 bg-green-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
