import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

/* ============================================================
   CONSTANTS
============================================================ */
const RARITY_CONFIG = {
  "Very Common": {
    color: "bg-green-100 text-green-800 border-green-300",
    dot: "bg-green-500",
    bar: "bg-green-500",
    width: "w-full",
  },
  Common: {
    color: "bg-blue-100 text-blue-800 border-blue-300",
    dot: "bg-blue-500",
    bar: "bg-blue-500",
    width: "w-4/5",
  },
  "Fairly Common": {
    color: "bg-amber-100 text-amber-800 border-amber-300",
    dot: "bg-amber-500",
    bar: "bg-amber-500",
    width: "w-3/5",
  },
  Uncommon: {
    color: "bg-orange-100 text-orange-800 border-orange-300",
    dot: "bg-orange-500",
    bar: "bg-orange-500",
    width: "w-2/5",
  },
  Rare: {
    color: "bg-rose-100 text-rose-800 border-rose-300",
    dot: "bg-rose-500",
    bar: "bg-rose-500",
    width: "w-1/5",
  },
};

const SEASON_EMOJI = {
  "Year-round": "🗓️",
  "Winter (Oct–Mar)": "❄️",
  "Summer breeding (Mar–Aug)": "☀️",
  "Summer (Mar–Aug)": "☀️",
  "Monsoon & Winter": "🌧️",
  "Winter (Sep–Apr)": "❄️",
  "Summer breeding (Apr–Sep)": "☀️",
};

const CATEGORIES = [
  "All",
  "Very Common",
  "Common",
  "Fairly Common",
  "Uncommon",
  "Rare",
];

const FOOTER_LINKS = {
  Explore: [
    { label: "Destinations", to: "/places" },
    { label: "Culture & Festivals", to: "/culture" },
    { label: "Activities", to: "/activities" },
    { label: "Book Now", to: "/book-now" },
    { label: "Blogs", to: "/blogs" },
  ],
  "AI Tools": [
    { label: "AI Chatbot", to: "/chatbot" },
    { label: "Disease Detector", to: "/disease-detector" },
    { label: "Recommender", to: "/recommendation" },
    { label: "Bird Guide", to: "/birds" },
  ],
  Account: [
    { label: "Login", to: "/login" },
    { label: "Sign Up", to: "/signup" },
    { label: "Dashboard", to: "/dashboard" },
    { label: "Admin Panel", to: "/admin-dashboard" },
  ],
};

/* ============================================================
   BIRD DETAIL MODAL
============================================================ */
function BirdModal({ bird, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const rc = RARITY_CONFIG[bird.rarity] || RARITY_CONFIG["Common"];

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onPrev();
      if (e.key === "ArrowRight" && hasNext) onNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 50 }}
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl overflow-hidden shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto"
        >
          {/* Hero image */}
          <div className="relative h-80 overflow-hidden bg-gray-200">
            <img
              src={bird.image_url}
              alt={bird.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800&q=80";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition text-2xl font-light"
            >
              ×
            </button>

            {/* Prev */}
            {hasPrev && (
              <button
                onClick={(e) => { e.stopPropagation(); onPrev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition text-xl"
              >
                ‹
              </button>
            )}

            {/* Next */}
            {hasNext && (
              <button
                onClick={(e) => { e.stopPropagation(); onNext(); }}
                className="absolute right-16 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition text-xl"
              >
                ›
              </button>
            )}

            {/* Name overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border backdrop-blur-sm inline-flex items-center gap-1.5 mb-2 ${rc.color}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${rc.dot}`} />
                {bird.rarity}
              </span>
              <h2 className="text-3xl font-black text-white mt-1">
                {bird.name}
              </h2>
              <p className="text-gray-300 italic text-sm mt-0.5">
                {bird.scientific_name}
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="p-8 space-y-6">
            <p className="text-gray-700 leading-relaxed text-[15px]">
              {bird.description}
            </p>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Habitat",  value: bird.habitat,        emoji: "🏡" },
                { label: "Region",   value: bird.region,         emoji: "📍" },
                { label: "Season",   value: bird.season,         emoji: SEASON_EMOJI[bird.season] || "🗓️" },
                { label: "Size",     value: bird.size,           emoji: "📏" },
                { label: "Diet",     value: bird.diet,           emoji: "🍽️" },
                { label: "Sound",    value: bird.sound,          emoji: "🎵" },
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                    {item.emoji} {item.label}
                  </p>
                  <p className="font-semibold text-gray-800 text-sm">
                    {item.value || "—"}
                  </p>
                </div>
              ))}
            </div>

            {bird.fun_fact && (
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-5">
                <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-2">
                  💡 Fun Fact
                </p>
                <p className="text-amber-900 text-sm leading-relaxed">
                  {bird.fun_fact}
                </p>
              </div>
            )}

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-2">
                🌾 Where to Spot
              </p>
              <p className="text-emerald-800 text-sm leading-relaxed">
                Best spotted at{" "}
                <strong>{bird.habitat?.toLowerCase()}</strong> during early
                morning hours (6–9 AM).{" "}
                {bird.season !== "Year-round"
                  ? `Visit during ${bird.season} for best chances.`
                  : "Can be seen year-round across India."}
              </p>
            </div>

            {/* Keyboard hint */}
            <p className="text-center text-xs text-gray-300">
              ← → arrow keys to navigate · Esc to close
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ============================================================
   BIRD CARD
============================================================ */
function BirdCard({ bird, index, onClick }) {
  const rc = RARITY_CONFIG[bird.rarity] || RARITY_CONFIG["Common"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: (index % 4) * 0.08, duration: 0.45 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={() => onClick(bird)}
      className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100"
    >
      <div className="relative h-52 overflow-hidden bg-gray-200">
        <img
          src={bird.image_url}
          alt={bird.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=600&q=80";
          }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

        <div className="absolute top-3 left-3">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full border backdrop-blur-sm flex items-center gap-1.5 ${rc.color}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${rc.dot}`} />
            {bird.rarity}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          <span className="text-xs bg-black/40 backdrop-blur-sm text-white px-2.5 py-1 rounded-full">
            {SEASON_EMOJI[bird.season] || "🗓️"}{" "}
            {bird.season === "Year-round"
              ? "Year-round"
              : bird.season?.split(" ")[0]}
          </span>
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white text-green-700 font-bold px-5 py-2.5 rounded-full text-sm shadow-xl">
            View Details →
          </div>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-base font-black text-gray-900 mb-0.5 group-hover:text-green-700 transition-colors leading-snug">
          {bird.name}
        </h3>
        <p className="text-xs text-gray-400 italic mb-3">
          {bird.scientific_name}
        </p>
        <p className="text-gray-600 text-xs leading-relaxed line-clamp-2 mb-4">
          {bird.description}
        </p>

        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Sighting chances</span>
            <span className="font-medium">{bird.rarity}</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${rc.bar} ${rc.width} transition-all duration-1000`}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            🏡{" "}
            <span className="truncate max-w-[6rem]">{bird.habitat}</span>
          </span>
          <span className="text-xs text-green-600 font-semibold">
            📏 {bird.size}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ============================================================
   FOOTER  — all links use <Link> from react-router-dom
============================================================ */
function BirdsFooter() {
  return (
    <footer className="bg-gray-950 text-white pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">

        {/* Top grid */}
        <div className="grid md:grid-cols-5 gap-10 mb-12">

          {/* Brand col */}
          <div className="md:col-span-2">
            <Link
              to="/"
              className="text-2xl font-black text-green-400 mb-4 block hover:text-green-300 transition-colors"
            >
              AgroVista 🌿
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              India's unified agrotourism platform integrating culture,
              nature & AI-powered tools for farm explorers.
            </p>
            <div className="flex gap-3">
              {[
                { icon: "𝕏",  label: "Twitter"   },
                { icon: "f",  label: "Facebook"  },
                { icon: "▶",  label: "YouTube"   },
                { icon: "📷", label: "Instagram" },
              ].map((s) => (
                <button
                  key={s.label}
                  title={s.label}
                  className="w-9 h-9 bg-gray-800 hover:bg-green-700 rounded-full flex items-center justify-center text-sm transition-colors duration-200 cursor-pointer"
                >
                  {s.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="font-bold text-gray-200 mb-4 text-sm uppercase tracking-wider">
                {heading}
              </h3>
              <ul className="space-y-2.5">
                {links.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="text-gray-400 hover:text-green-400 text-sm transition-colors duration-200 hover:underline underline-offset-2"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact strip */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="flex flex-wrap gap-6 justify-center md:justify-start text-sm text-gray-400">
            <span>📧 support@agrovista.com</span>
            <span>📞 +91 98765 43210</span>
            <span>📍 Rural India Network</span>
            <span>🕐 9 AM – 6 PM IST</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <span>© 2026 AgroVista. Made with 🌿 for Rural India.</span>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-green-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/" className="hover:text-green-400 transition-colors">
              Terms of Service
            </Link>
            <Link to="/places" className="hover:text-green-400 transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   MAIN PAGE
============================================================ */
export default function Birds() {
  const [birds, setBirds]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [search, setSearch]             = useState("");
  const [activeRarity, setActiveRarity] = useState("All");
  const [activeRegion, setActiveRegion] = useState("All");
  const [activeSeason, setActiveSeason] = useState("All");

  /* fetch */
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/birds")
      .then((res) => setBirds(res.data))
      .catch((err) => console.error("Birds fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  /* derived filter options */
  const regions = ["All", ...new Set(birds.map((b) => b.region).filter(Boolean))];
  const seasons = ["All", ...new Set(birds.map((b) => b.season).filter(Boolean))];

  /* filtered list */
  const filtered = birds.filter((b) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      b.name?.toLowerCase().includes(q) ||
      b.habitat?.toLowerCase().includes(q) ||
      b.description?.toLowerCase().includes(q) ||
      b.scientific_name?.toLowerCase().includes(q);
    const matchRarity  = activeRarity  === "All" || b.rarity  === activeRarity;
    const matchRegion  = activeRegion  === "All" || b.region  === activeRegion;
    const matchSeason  = activeSeason  === "All" || b.season  === activeSeason;
    return matchSearch && matchRarity && matchRegion && matchSeason;
  });

  const hasFilters =
    search || activeRarity !== "All" || activeRegion !== "All" || activeSeason !== "All";

  const clearFilters = () => {
    setSearch("");
    setActiveRarity("All");
    setActiveRegion("All");
    setActiveSeason("All");
  };

  /* modal helpers */
  const openModal  = (bird) => setSelectedIndex(filtered.findIndex((b) => b.id === bird.id));
  const closeModal = ()     => setSelectedIndex(null);
  const prevBird   = ()     => setSelectedIndex((i) => Math.max(0, i - 1));
  const nextBird   = ()     => setSelectedIndex((i) => Math.min(filtered.length - 1, i + 1));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col min-h-screen bg-white"
    >
      {/* Navbar */}
      <Navbar />

      {/* ===== HERO ===== */}
      <div className="relative h-[360px] overflow-hidden mt-16">
        <img
          src="https://images.unsplash.com/photo-1444464666168-49d633b86797?w=1400&q=85"
          alt="Birds of India"
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/75" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-bold px-4 py-2 rounded-full mb-4 uppercase tracking-widest"
          >
            🦜 Nature & Wildlife
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-5xl md:text-6xl font-black mb-3"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Birds of
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-200">
              Rural India
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-200 max-w-xl text-lg"
          >
            {loading
              ? "Loading species..."
              : `Explore ${birds.length} bird species found across India's agro farms`}
          </motion.p>
        </div>
      </div>

      {/* ===== BODY ===== */}
      <div className="flex-grow bg-gradient-to-br from-sky-50 via-white to-emerald-50">

        {/* Stats bar */}
        {!loading && (
          <div className="bg-white border-b border-gray-100 shadow-sm">
            <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap gap-6 justify-center">
              {[
                { label: "Total Species",  value: birds.length,                                     emoji: "🦜" },
                { label: "Rare Species",   value: birds.filter((b) => b.rarity === "Rare").length,  emoji: "🔴" },
                { label: "Year-round",     value: birds.filter((b) => b.season === "Year-round").length, emoji: "🗓️" },
                { label: "Best Time",      value: "6–9 AM",                                         emoji: "🌅" },
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

        <div className="max-w-6xl mx-auto px-6 py-10">

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mb-6 max-w-xl mx-auto"
          >
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search by name, habitat, region..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-10 py-4 rounded-2xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700 placeholder-gray-400"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            )}
          </motion.div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveRarity(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                    activeRarity === cat
                      ? "bg-green-600 text-white border-green-600 shadow-md"
                      : "bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <select
              value={activeRegion}
              onChange={(e) => setActiveRegion(e.target.value)}
              className="px-4 py-2 rounded-full border border-gray-200 bg-white text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer"
            >
              {regions.map((r) => (
                <option key={r} value={r}>{r === "All" ? "All Regions" : `📍 ${r}`}</option>
              ))}
            </select>
            <select
              value={activeSeason}
              onChange={(e) => setActiveSeason(e.target.value)}
              className="px-4 py-2 rounded-full border border-gray-200 bg-white text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer"
            >
              {seasons.map((s) => (
                <option key={s} value={s}>{s === "All" ? "All Seasons" : `🗓️ ${s}`}</option>
              ))}
            </select>
          </div>

          {/* Results bar */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-bold text-gray-900">{filtered.length}</span>
              {" "}of{" "}
              <span className="font-bold text-gray-900">{birds.length}</span>{" "}
              species
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
                className="w-12 h-12 border-4 border-green-100 border-t-green-600 rounded-full"
              />
              <p className="text-gray-500">Loading bird species...</p>
            </div>
          )}

          {/* Grid */}
          {!loading && filtered.length > 0 && (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filtered.map((bird, i) => (
                <BirdCard key={bird.id} bird={bird} index={i} onClick={openModal} />
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
              <h3 className="text-xl font-bold text-gray-700 mb-2">No birds found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
              <button
                onClick={clearFilters}
                className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition"
              >
                Show All Birds
              </button>
            </motion.div>
          )}

          {/* Tips */}
          {!loading && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-20 bg-gradient-to-r from-green-700 to-emerald-600 rounded-3xl p-10 text-white"
            >
              <h2 className="text-2xl font-black mb-8 text-center">
                🌅 Bird Watching Tips for Farm Visits
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    emoji: "⏰",
                    title: "Best Time",
                    tip: "Early morning 6–9 AM and late evening 5–7 PM are peak activity hours for most farm birds.",
                  },
                  {
                    emoji: "🔭",
                    title: "Equipment",
                    tip: "Carry binoculars (8×42), a field guide, and wear earth-tone clothing to avoid startling birds.",
                  },
                  {
                    emoji: "🌾",
                    title: "Hotspots",
                    tip: "Water bodies, field edges, tree rows and old farm structures are the richest bird habitats.",
                  },
                ].map((t, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                    <div className="text-4xl mb-3">{t.emoji}</div>
                    <h3 className="font-bold text-lg mb-2">{t.title}</h3>
                    <p className="text-green-100 text-sm leading-relaxed">{t.tip}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <BirdsFooter />

      {/* ===== MODAL ===== */}
      {selectedIndex !== null && filtered[selectedIndex] && (
        <BirdModal
          bird={filtered[selectedIndex]}
          onClose={closeModal}
          onPrev={prevBird}
          onNext={nextBird}
          hasPrev={selectedIndex > 0}
          hasNext={selectedIndex < filtered.length - 1}
        />
      )}
    </motion.div>
  );
}