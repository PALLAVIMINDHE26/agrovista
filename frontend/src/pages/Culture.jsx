import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";

/* ============================================================
   CONSTANTS
============================================================ */
const REGIONS = [
  "All Regions",
  "South India",
  "North India",
  "Northeast India",
  "West India",
  "East India",
  "Pan India",
];

const SEASON_FILTERS = [
  "All Seasons",
  "January",
  "February",
  "March",
  "April",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const FOOTER_LINKS = {
  Explore: [
    { label: "Destinations",     to: "/places" },
    { label: "Activities",       to: "/activities" },
    { label: "Book Now",         to: "/book-now" },
    { label: "Blogs",            to: "/blogs" },
    { label: "Birds",            to: "/birds" },
  ],
  "AI Tools": [
    { label: "AI Chatbot",       to: "/chatbot" },
    { label: "Disease Detector", to: "/disease-detector" },
    { label: "Recommender",      to: "/recommendation" },
  ],
  Account: [
    { label: "Login",            to: "/login" },
    { label: "Sign Up",          to: "/signup" },
    { label: "Dashboard",        to: "/dashboard" },
    { label: "Admin Panel",      to: "/admin-dashboard" },
  ],
};

/* ============================================================
   FESTIVAL CARD
============================================================ */
function FestivalCard({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: (index % 3) * 0.1, duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-orange-100"
    >
      <Link to={`/culture/${item.id}`}>
        {/* Image */}
        <div className="relative h-56 overflow-hidden bg-orange-100">
          <img
            src={item.image_url}
            alt={item.festival_name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1534759926685-7e4e6222b8e3?w=600&q=80";
            }}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* State badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              📍 {item.state_name}
            </span>
          </div>

          {/* Region badge */}
          {item.region && (
            <div className="absolute top-3 right-3">
              <span className="bg-black/40 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
                {item.region}
              </span>
            </div>
          )}

          {/* Festival name on image */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h3 className="text-xl font-black text-white leading-tight">
              🎉 {item.festival_name}
            </h3>
            {item.best_time && (
              <p className="text-orange-200 text-xs mt-1">
                🗓️ {item.best_time}
              </p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
            {item.description}
          </p>

          {/* Crops celebrated */}
          {item.crops_celebrated && item.crops_celebrated.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {item.crops_celebrated.slice(0, 3).map((crop, i) => (
                <span
                  key={i}
                  className="bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-full border border-green-100"
                >
                  🌾 {crop}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-orange-100">
            <span className="text-xs text-gray-400">
              Tap to explore history & rituals →
            </span>
            <div className="w-8 h-8 bg-orange-500 group-hover:bg-orange-600 rounded-full flex items-center justify-center transition-colors">
              <span className="text-white text-sm">→</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ============================================================
   FOOTER
============================================================ */
function CultureFooter() {
  return (
    <footer className="bg-gray-950 text-white pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-10 mb-12">
          <div className="md:col-span-2">
            <Link
              to="/"
              className="text-2xl font-black text-green-400 mb-4 block hover:text-green-300 transition-colors"
            >
              AgroVista 🌿
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Celebrating the rich harvest traditions and cultural festivals
              of rural India — connecting you to authentic agrotourism
              experiences across all 28 states.
            </p>
            <div className="flex gap-3">
              {["𝕏", "f", "▶", "📷"].map((icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 bg-gray-800 hover:bg-green-700 rounded-full flex items-center justify-center text-sm transition-colors"
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="font-bold text-gray-200 mb-4 text-xs uppercase tracking-widest">
                {heading}
              </h3>
              <ul className="space-y-2.5">
                {links.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="text-gray-400 hover:text-green-400 text-sm transition-colors hover:underline underline-offset-2"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="flex flex-wrap gap-6 justify-center md:justify-start text-sm text-gray-400">
            <span>📧 support@agrovista.com</span>
            <span>📞 +91 98765 43210</span>
            <span>📍 Rural India Network</span>
            <span>🕐 9 AM – 6 PM IST</span>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <span>© 2026 AgroVista. Made with 🌿 for Rural India.</span>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-green-400 transition-colors">Privacy Policy</Link>
            <Link to="/" className="hover:text-green-400 transition-colors">Terms of Service</Link>
            <Link to="/culture" className="hover:text-green-400 transition-colors">All Festivals</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   MAIN PAGE
============================================================ */
export default function Culture() {
  const [data, setData]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedSeason, setSelectedSeason] = useState("All Seasons");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/culture")
      .then((res) => setData(res.data))
      .catch((err) => console.log("Error fetching culture:", err))
      .finally(() => setLoading(false));
  }, []);

  /* ---- derived filters ---- */
  const states = ["All States", ...new Set(data.map((d) => d.state_name).filter(Boolean))];

  const filtered = data.filter((item) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      item.festival_name?.toLowerCase().includes(q) ||
      item.state_name?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q) ||
      item.crops_celebrated?.some((c) => c.toLowerCase().includes(q));
    const matchRegion =
      selectedRegion === "All Regions" || item.region === selectedRegion;
    const matchSeason =
      selectedSeason === "All Seasons" ||
      item.best_time?.toLowerCase().includes(selectedSeason.toLowerCase());
    return matchSearch && matchRegion && matchSeason;
  });

  const clearFilters = () => {
    setSearch("");
    setSelectedRegion("All Regions");
    setSelectedSeason("All Seasons");
  };

  const hasFilters =
    search || selectedRegion !== "All Regions" || selectedSeason !== "All Seasons";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen bg-white"
    >
      <Navbar />

      {/* ===== HERO ===== */}
      <div className="relative h-[400px] overflow-hidden mt-16">
        <img
          src="https://images.unsplash.com/photo-1534759926685-7e4e6222b8e3?w=1400&q=85"
          alt="Indian Culture"
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-orange-900/60 via-black/30 to-black/80" />

        {/* Floating decorative elements */}
        {["🎉", "🌾", "🪔", "🎭", "🥁"].map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl opacity-40"
            style={{ left: `${10 + i * 20}%`, top: `${20 + (i % 3) * 20}%` }}
            animate={{ y: [-8, 8, -8], rotate: [-5, 5, -5] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
          >
            {emoji}
          </motion.div>
        ))}

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-orange-500/20 backdrop-blur-sm border border-orange-300/30 text-xs font-bold px-4 py-2 rounded-full mb-4 uppercase tracking-widest"
          >
            🎭 India's Harvest Festival Heritage
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-5xl md:text-6xl font-black mb-3 leading-tight"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Culture &
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-amber-200">
              Harvest Festivals
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-orange-100 max-w-xl text-lg mb-8"
          >
            {loading
              ? "Loading festivals..."
              : `Explore ${data.length} harvest festivals celebrating India's agricultural soul`}
          </motion.p>

          {/* Hero search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="relative w-full max-w-xl"
          >
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search festivals, states, crops..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white/95 backdrop-blur-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-2xl"
            />
          </motion.div>
        </div>
      </div>

      {/* ===== STATS BAR ===== */}
      {!loading && (
        <div className="bg-white border-b border-orange-100 shadow-sm">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap gap-8 justify-center">
            {[
              { label: "Festivals",  value: data.length,                                              emoji: "🎉" },
              { label: "States",     value: new Set(data.map((d) => d.state_name)).size,              emoji: "🇮🇳" },
              { label: "Regions",    value: new Set(data.map((d) => d.region).filter(Boolean)).size,  emoji: "🗺️" },
              { label: "Heritage",   value: "2,000+ yrs",                                             emoji: "📜" },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="text-2xl">{s.emoji}</span>
                <div>
                  <span className="font-black text-gray-900 text-base">{s.value}</span>
                  <span className="text-gray-400 ml-1.5">{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-grow bg-gradient-to-br from-orange-50/30 via-white to-amber-50/30">
        <div className="max-w-6xl mx-auto px-6 py-10">

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-8 items-center justify-center">
            {/* Region filter */}
            <div className="flex flex-wrap gap-2">
              {REGIONS.map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                    selectedRegion === region
                      ? "bg-orange-500 text-white border-orange-500 shadow-md"
                      : "bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-600"
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>

            {/* Season filter */}
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="px-4 py-2 rounded-full border border-gray-200 bg-white text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer"
            >
              {SEASON_FILTERS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Results bar */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-bold text-gray-900">{filtered.length}</span>{" "}
              of{" "}
              <span className="font-bold text-gray-900">{data.length}</span>{" "}
              festivals
            </p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-red-500 hover:underline"
              >
                Clear all ×
              </button>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
                className="w-12 h-12 border-4 border-orange-100 border-t-orange-500 rounded-full"
              />
              <p className="text-gray-500">Loading festivals...</p>
            </div>
          )}

          {/* Grid */}
          {!loading && filtered.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item, i) => (
                <FestivalCard key={item.id} item={item} index={i} />
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <div className="text-7xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                No festivals found
              </h3>
              <p className="text-gray-500 mb-6">
                Try different search terms or clear your filters
              </p>
              <button
                onClick={clearFilters}
                className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition"
              >
                Show All Festivals
              </button>
            </motion.div>
          )}

          {/* CTA */}
          {!loading && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-20 bg-gradient-to-r from-orange-600 to-amber-500 rounded-3xl p-10 text-white text-center"
            >
              <div className="text-5xl mb-4">🌾</div>
              <h2 className="text-2xl font-black mb-3">
                Experience These Festivals First-hand
              </h2>
              <p className="text-orange-100 mb-6 max-w-xl mx-auto">
                Book an agrotourism stay timed with harvest festivals and
                experience India's living agricultural culture.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <button
                  onClick={() => navigate("/places")}
                  className="bg-white text-orange-700 font-bold px-8 py-3 rounded-2xl hover:bg-orange-50 transition hover:scale-105 shadow-xl"
                >
                  Browse Destinations 🗺️
                </button>
                <button
                  onClick={() => navigate("/recommendation")}
                  className="bg-orange-700 hover:bg-orange-800 text-white font-bold px-8 py-3 rounded-2xl transition hover:scale-105 border border-orange-400"
                >
                  Plan My Festival Trip 🧠
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <CultureFooter />
    </motion.div>
  );
}