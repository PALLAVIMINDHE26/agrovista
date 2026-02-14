import { Link } from "react-router-dom";
// import { useState } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Navbar() {
  const [exploreOpen, setExploreOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const token = localStorage.getItem("token");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

useEffect(() => {
  const token = localStorage.getItem("token");
  setIsLoggedIn(!!token);
}, []);


  return (
    <nav className="fixed w-full top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 shadow-md">
      <div className="flex justify-between items-center px-10 py-4">

        <Link to="/" className="text-2xl font-bold text-green-700">
          AgroVista 🌿
        </Link>

        <div className="hidden md:flex gap-8 items-center font-medium">

          <Link to="/">Home</Link>

          {/* Explore Dropdown */}
          <div className="relative">
            <button onClick={() => setExploreOpen(!exploreOpen)}>
              Explore ▾
            </button>
            {exploreOpen && (
              <div className="absolute mt-2 bg-white shadow-lg rounded-lg w-48 py-2">
                <Link to="/places" className="block px-4 py-2 hover:bg-green-50">Destinations</Link>
                <Link to="/culture" className="block px-4 py-2 hover:bg-green-50">Culture</Link>
                <Link to="/activities" className="block px-4 py-2 hover:bg-green-50">Activities</Link>
                <Link to="/book-now" className="block px-4 py-2 hover:bg-green-50">Book Now</Link>
              </div>
            )}
          </div>

          {/* AI Dropdown */}
          <div className="relative">
            <button onClick={() => setAiOpen(!aiOpen)}>
              AI ▾
            </button>
            {aiOpen && (
              <div className="absolute mt-2 bg-white shadow-lg rounded-lg w-48 py-2">
                <Link to="/chatbot" className="block px-4 py-2 hover:bg-green-50">AI Chatbot</Link>
                <Link to="/disease-detector" className="block px-4 py-2 hover:bg-green-50">Disease Detector</Link>
                <Link to="/recommendation" className="block px-4 py-2 hover:bg-green-50">Recommendation</Link>
              </div>
            )}
          </div>

          <Link to="/blogs">Blogs</Link>
          <Link to="/birds">Birds</Link>

          {!isLoggedIn ? (
          <button onClick={() => navigate("/login")}
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Login
         </button>
          ) : (
        <div className="relative group">
           <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
              Dashboard ▾
           </button>

        <div className="absolute hidden group-hover:block bg-white shadow-lg rounded mt-2 w-40">
          <button onClick={() => navigate("/dashboard")}
          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
             User Dashboard
          </button>

        <button onClick={() => navigate("/admin-dashboard")}
         className="block w-full text-left px-4 py-2 hover:bg-gray-100"
        >
           Admin Dashboard
         </button>

        <button onClick={() => {
          localStorage.removeItem("token");
          navigate("/");
          window.location.reload();
         }}
        className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
        >
           Logout
         </button>
     </div>
     </div>
    )}

     </div>
     </div>
    </nav>
  );
}
