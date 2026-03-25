import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function Navbar() {
  const [exploreOpen, setExploreOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [dashOpen, setDashOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      if (token) {
        setIsLoggedIn(true);
        try {
          const decoded = jwtDecode(token);
          setUser(decoded);
        } catch {
          setIsLoggedIn(false);
          setUser(null);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkToken();
    window.addEventListener("storage", checkToken);
    return () => window.removeEventListener("storage", checkToken);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const close = () => {
      setExploreOpen(false);
      setAiOpen(false);
      setDashOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/login");
    window.location.reload();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      scrolled
        ? "bg-white shadow-lg"
        : "bg-white/90 backdrop-blur-md shadow-md"
    }`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">

        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl font-black text-green-700 flex items-center gap-2 hover:scale-105 transition-transform"
        >
          AgroVista 🌿
        </Link>

        {/* NAV LINKS */}
        <div className="hidden md:flex gap-1 items-center">

          {/* Home */}
          <Link
            to="/"
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              isActive("/")
                ? "bg-green-100 text-green-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Home
          </Link>

          {/* Explore Dropdown */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => {
                setExploreOpen(!exploreOpen);
                setAiOpen(false);
                setDashOpen(false);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1 ${
                exploreOpen
                  ? "bg-green-100 text-green-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Explore
              <span className={`transition-transform duration-200 ${exploreOpen ? "rotate-180" : ""}`}>
                ▾
              </span>
            </button>

            {exploreOpen && (
              <div className="absolute top-full mt-2 left-0 bg-white shadow-2xl rounded-2xl w-52 py-2 border border-gray-100 z-50">
                {[
                  { label: "🗺️ Destinations", link: "/places" },
                  { label: "🎭 Culture", link: "/culture" },
                  { label: "🎯 Activities", link: "/activities" },
                  { label: "📅 Book Now", link: "/book-now" },
                  { label: "🐦 Birds", link: "/birds" },
                  { label: "📝 Blogs", link: "/blogs" },
                ].map((item) => (
                  <Link
                    key={item.link}
                    to={item.link}
                    onClick={() => setExploreOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 hover:bg-green-50 text-gray-700 hover:text-green-700 text-sm font-medium transition"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* AI Tools Dropdown */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => {
                setAiOpen(!aiOpen);
                setExploreOpen(false);
                setDashOpen(false);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1 ${
                aiOpen
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              AI Tools
              <span className={`transition-transform duration-200 ${aiOpen ? "rotate-180" : ""}`}>
                ▾
              </span>
            </button>

            {aiOpen && (
              <div className="absolute top-full mt-2 left-0 bg-white shadow-2xl rounded-2xl w-56 py-2 border border-gray-100 z-50">
                {[
                  { label: "🤖 AI Chatbot", link: "/chatbot", desc: "Ask anything" },
                  { label: "🌿 Disease Detector", link: "/disease-detector", desc: "Upload leaf photo" },
                  { label: "🧠 Trip Recommender", link: "/recommendation", desc: "Plan your trip" },
                ].map((item) => (
                  <Link
                    key={item.link}
                    to={item.link}
                    onClick={() => setAiOpen(false)}
                    className="flex flex-col px-4 py-3 hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition group"
                  >
                    <span className="text-sm font-semibold">{item.label}</span>
                    <span className="text-xs text-gray-400 group-hover:text-blue-400">
                      {item.desc}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          {!isLoggedIn ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="text-sm font-semibold text-gray-600 hover:text-green-700 px-4 py-2 rounded-xl hover:bg-gray-100 transition"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="text-sm font-semibold bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl transition hover:scale-105 shadow-sm"
              >
                Sign Up
              </button>
            </>
          ) : (
            <div
              className="relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* User button */}
              <button
                onClick={() => {
                  setDashOpen(!dashOpen);
                  setExploreOpen(false);
                  setAiOpen(false);
                }}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white pl-3 pr-4 py-2 rounded-xl transition hover:scale-105 shadow-sm"
              >
                {/* Avatar circle */}
                <div className="w-7 h-7 bg-green-400 rounded-full flex items-center justify-center text-xs font-black">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span className="text-sm font-semibold max-w-[80px] truncate">
                  {user?.name?.split(" ")[0] || "Account"}
                </span>
                <span className={`text-xs transition-transform duration-200 ${dashOpen ? "rotate-180" : ""}`}>
                  ▾
                </span>
              </button>

              {/* Dashboard dropdown */}
              {dashOpen && (
                <div className="absolute top-full mt-2 right-0 bg-white shadow-2xl rounded-2xl w-64 border border-gray-100 overflow-hidden z-50">

                  {/* User info header */}
                  <div className="bg-green-50 px-4 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-black">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">
                          {user?.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate max-w-[140px]">
                          {user?.email}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${
                          user?.role === "admin"
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}>
                          {user?.role || "user"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dashboard links */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        navigate("/dashboard");
                        setDashOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 text-gray-700 hover:text-green-700 transition text-sm font-medium"
                    >
                      <span className="text-lg">📊</span>
                      <div className="text-left">
                        <p className="font-semibold">User Dashboard</p>
                        <p className="text-xs text-gray-400">Bookings & profile</p>
                      </div>
                    </button>

                    {user?.role === "admin" && (
                      <button
                        onClick={() => {
                          navigate("/admin-dashboard");
                          setDashOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-gray-700 hover:text-red-600 transition text-sm font-medium"
                      >
                        <span className="text-lg">⚙️</span>
                        <div className="text-left">
                          <p className="font-semibold">Admin Dashboard</p>
                          <p className="text-xs text-gray-400">Manage platform</p>
                        </div>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        navigate("/edit-profile");
                        setDashOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition text-sm font-medium"
                    >
                      <span className="text-lg">✏️</span>
                      <div className="text-left">
                        <p className="font-semibold">Edit Profile</p>
                        <p className="text-xs text-gray-400">Update your info</p>
                      </div>
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-100 p-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-500 hover:text-red-600 rounded-xl transition text-sm font-semibold"
                    >
                      <span className="text-lg">🚪</span>
                      Logout
                    </button>
                  </div>

                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}