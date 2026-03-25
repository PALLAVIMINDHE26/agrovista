import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";

/* ============================================================
   CONSTANTS
============================================================ */
const CATEGORIES = ["All", "Outdoor", "Workshop", "Cultural"];

const DIFFICULTIES = ["All", "Easy", "Moderate", "Hard"];

const SORT_OPTIONS = [
  { value: "",            label: "Default" },
  { value: "price_asc",  label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating",     label: "Top Rated" },
  { value: "duration",   label: "Duration" },
];

const CATEGORY_CONFIG = {
  Outdoor:   { color: "bg-green-100 text-green-800 border-green-300",  icon: "🌿", bg: "from-green-500 to-emerald-600" },
  Workshop:  { color: "bg-blue-100 text-blue-800 border-blue-300",    icon: "🎨", bg: "from-blue-500 to-indigo-600" },
  Cultural:  { color: "bg-orange-100 text-orange-800 border-orange-300", icon: "🎭", bg: "from-orange-500 to-amber-600" },
};

const DIFFICULTY_CONFIG = {
  Easy:     { color: "bg-green-100 text-green-700",  dot: "bg-green-500" },
  Moderate: { color: "bg-amber-100 text-amber-700",  dot: "bg-amber-500" },
  Hard:     { color: "bg-red-100 text-red-700",      dot: "bg-red-500"   },
};

const FOOTER_LINKS = {
  Explore: [
    { label: "Destinations",     to: "/places"           },
    { label: "Culture",          to: "/culture"          },
    { label: "Book Now",         to: "/book-now"         },
    { label: "Blogs",            to: "/blogs"            },
    { label: "Birds",            to: "/birds"            },
  ],
  "AI Tools": [
    { label: "AI Chatbot",       to: "/chatbot"          },
    { label: "Disease Detector", to: "/disease-detector" },
    { label: "Recommender",      to: "/recommendation"   },
  ],
  Account: [
    { label: "Login",            to: "/login"            },
    { label: "Sign Up",          to: "/signup"           },
    { label: "Dashboard",        to: "/dashboard"        },
    { label: "Admin Panel",      to: "/admin-dashboard"  },
  ],
};

/* ============================================================
   ACTIVITY CARD
============================================================ */
function ActivityCard({ activity, index }) {
  const cat  = CATEGORY_CONFIG[activity.category]  || CATEGORY_CONFIG.Outdoor;
  const diff = DIFFICULTY_CONFIG[activity.difficulty] || DIFFICULTY_CONFIG.Easy;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: (index % 3) * 0.09, duration: 0.45 }}
      whileHover={{ y: -8 }}
      className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col"
    >
      <Link to={`/activities/${activity.id}`} className="flex flex-col flex-1">
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-gray-200 flex-shrink-0">
          <img
            src={activity.image_url}
            alt={activity.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=80";
            }}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className={`text-xs font-bold px-3 py-1 rounded-full border backdrop-blur-sm ${cat.color}`}>
              {cat.icon} {activity.category}
            </span>
          </div>

          {/* Rating */}
          {activity.average_rating > 0 && (
            <div className="absolute top-3 right-3">
              <span className="bg-amber-400 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                ⭐ {Number(activity.average_rating).toFixed(1)}
              </span>
            </div>
          )}

          {/* Top rated badge */}
          {activity.average_rating >= 4.8 && (
            <div className="absolute bottom-3 left-3">
              <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                🏆 Top Rated
              </span>
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white text-green-700 font-bold px-5 py-2.5 rounded-full text-sm shadow-xl">
              View Details →
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-base font-black text-gray-900 mb-2 group-hover:text-green-700 transition-colors leading-snug line-clamp-2">
            {activity.title}
          </h3>

          <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4 flex-1">
            {activity.short_description || activity.full_description?.substring(0, 120) + "..."}
          </p>

          {/* Highlight chip */}
          {activity.highlight && (
            <div className="bg-green-50 border border-green-100 rounded-xl px-3 py-2 mb-4">
              <p className="text-green-700 text-xs font-semibold line-clamp-1">
                ✨ {activity.highlight}
              </p>
            </div>
          )}

          {/* Meta row */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${diff.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${diff.dot}`} />
              {activity.difficulty}
            </span>
            <span className="text-xs text-gray-400">⏳ {activity.duration}</span>
            {activity.group_size && (
              <span className="text-xs text-gray-400">👥 {activity.group_size}</span>
            )}
          </div>

          {/* Price row */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div>
              <span className="text-xl font-black text-green-700">
                ₹{Number(activity.price).toLocaleString()}
              </span>
              <span className="text-xs text-gray-400 ml-1">/ person</span>
            </div>
            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${cat.bg} flex items-center justify-center text-white text-sm group-hover:scale-110 transition-transform`}>
              →
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
function ActivitiesFooter() {
  return (
    <footer className="bg-gray-950 text-white pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-10 mb-12">
          <div className="md:col-span-2">
            <Link to="/" className="text-2xl font-black text-green-400 mb-4 block hover:text-green-300 transition-colors">
              AgroVista 🌿
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Curated agrotourism activities across India — from farm walks
              and cooking masterclasses to balloon rides and stargazing.
            </p>
            <div className="flex gap-3">
              {["𝕏", "f", "▶", "📷"].map((icon, i) => (
                <button key={i} className="w-9 h-9 bg-gray-800 hover:bg-green-700 rounded-full flex items-center justify-center text-sm transition-colors">
                  {icon}
                </button>
              ))}
            </div>
          </div>
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="font-bold text-gray-200 mb-4 text-xs uppercase tracking-widest">{heading}</h3>
              <ul className="space-y-2.5">
                {links.map((item) => (
                  <li key={item.label}>
                    <Link to={item.to} className="text-gray-400 hover:text-green-400 text-sm transition-colors hover:underline underline-offset-2">
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
            <Link to="/activities" className="hover:text-green-400 transition-colors">All Activities</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   MAIN PAGE
============================================================ */
export default function Activities() {
  const [activities, setActivities]       = useState([]);
  const [loading, setLoading]             = useState(true);
  const [search, setSearch]               = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeDifficulty, setActiveDifficulty] = useState("All");
  const [maxPrice, setMaxPrice]           = useState(5000);
  const [sortOrder, setSortOrder]         = useState("");
  const [visibleCount, setVisibleCount]   = useState(12);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/activities")
      .then((res) => setActivities(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* ---- filter + sort ---- */
  let filtered = activities.filter((a) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      a.title?.toLowerCase().includes(q) ||
      a.short_description?.toLowerCase().includes(q) ||
      a.category?.toLowerCase().includes(q);
    const matchCat   = activeCategory   === "All" || a.category   === activeCategory;
    const matchDiff  = activeDifficulty === "All" || a.difficulty === activeDifficulty;
    const matchPrice = Number(a.price) <= maxPrice;
    return matchSearch && matchCat && matchDiff && matchPrice;
  });

  if (sortOrder === "price_asc")  filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortOrder === "price_desc") filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sortOrder === "rating")     filtered = [...filtered].sort((a, b) => b.average_rating - a.average_rating);
  if (sortOrder === "duration")   filtered = [...filtered].sort((a, b) => a.duration?.localeCompare(b.duration));

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const clearFilters = () => {
    setSearch("");
    setActiveCategory("All");
    setActiveDifficulty("All");
    setMaxPrice(5000);
    setSortOrder("");
  };

  const hasFilters = search || activeCategory !== "All" || activeDifficulty !== "All" || maxPrice < 5000 || sortOrder;

  /* ---- stats ---- */
  const avgRating = activities.length
    ? (activities.reduce((s, a) => s + Number(a.average_rating || 0), 0) / activities.length).toFixed(1)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen bg-white"
    >
      <Navbar />

      {/* ===== HERO ===== */}
      <div className="relative h-[420px] overflow-hidden mt-16">
        <img
          src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1400&q=90"
          alt="Farm Activities"
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80" />

        {/* Floating category pills */}
        {["🌿 Outdoor", "🎨 Workshop", "🎭 Cultural"].map((label, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/15 backdrop-blur-sm border border-white/25 text-white text-xs font-bold px-3 py-1.5 rounded-full"
            style={{ top: `${25 + i * 20}%`, right: `${8 + i * 5}%` }}
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
          >
            {label}
          </motion.div>
        ))}

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-green-500/20 backdrop-blur-sm border border-green-300/30 text-xs font-bold px-4 py-2 rounded-full mb-4 uppercase tracking-widest"
          >
            🎯 Curated Farm Experiences Across India
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-black mb-3 leading-tight"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Agrotourism
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-200">
              Activities
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-200 max-w-2xl text-lg mb-8"
          >
            {loading
              ? "Loading activities..."
              : `${activities.length}+ curated farm experiences — from ₹299 to ₹4,999`}
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
              placeholder="Search activities, workshops, experiences..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white/95 backdrop-blur-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-2xl"
            />
          </motion.div>
        </div>
      </div>

      {/* ===== STATS BAR ===== */}
      {!loading && (
        <div className="bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap gap-8 justify-center">
            {[
              { label: "Activities",   value: activities.length,                                              emoji: "🎯" },
              { label: "Outdoor",      value: activities.filter(a => a.category === "Outdoor").length,        emoji: "🌿" },
              { label: "Workshops",    value: activities.filter(a => a.category === "Workshop").length,       emoji: "🎨" },
              { label: "Avg Rating",   value: avgRating,                                                      emoji: "⭐" },
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

      {/* ===== MAIN ===== */}
      <div className="flex-grow bg-gradient-to-br from-green-50/30 via-white to-emerald-50/20">
        <div className="max-w-6xl mx-auto px-6 py-10">

          {/* Category pills */}
          <div className="flex flex-wrap gap-3 mb-6 justify-center">
            {CATEGORIES.map((cat) => {
              const cfg = cat === "All" ? null : CATEGORY_CONFIG[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold border transition-all duration-200 ${
                    activeCategory === cat
                      ? "bg-green-600 text-white border-green-600 shadow-md"
                      : "bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-600"
                  }`}
                >
                  {cfg ? `${cfg.icon} ` : ""}{cat}
                </button>
              );
            })}
          </div>

          {/* Filters row */}
          <div className="flex flex-wrap gap-3 mb-8 items-center justify-center">
            {/* Difficulty */}
            <div className="flex gap-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  onClick={() => setActiveDifficulty(d)}
                  className={`px-4 py-2 rounded-full text-xs font-bold border transition-all duration-200 ${
                    activeDifficulty === d
                      ? "bg-gray-800 text-white border-gray-800"
                      : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Price slider */}
            <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-full px-4 py-2">
              <span className="text-xs text-gray-500 whitespace-nowrap">Max ₹{maxPrice.toLocaleString()}</span>
              <input
                type="range"
                min="299"
                max="5000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-24 accent-green-600"
              />
            </div>

            {/* Sort */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-4 py-2 rounded-full border border-gray-200 bg-white text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Results bar */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">
              Showing <span className="font-bold text-gray-900">{Math.min(visibleCount, filtered.length)}</span>
              {" "}of{" "}
              <span className="font-bold text-gray-900">{filtered.length}</span>{" "}activities
            </p>
            {hasFilters && (
              <button onClick={clearFilters} className="text-sm text-red-500 hover:underline">
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
              <p className="text-gray-500">Loading activities...</p>
            </div>
          )}

          {/* Grid */}
          {!loading && visible.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.map((activity, i) => (
                <ActivityCard key={activity.id} activity={activity} index={i} />
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
              <div className="text-7xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No activities found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or price range</p>
              <button onClick={clearFilters} className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition">
                Show All Activities
              </button>
            </motion.div>
          )}

          {/* Load more */}
          {!loading && hasMore && (
            <div className="text-center mt-12">
              <button
                onClick={() => setVisibleCount(c => c + 9)}
                className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-2xl font-bold text-base transition-all hover:scale-105 shadow-lg"
              >
                Load More Activities ({filtered.length - visibleCount} remaining)
              </button>
            </div>
          )}

          {/* CTA */}
          {!loading && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-20 bg-gradient-to-r from-green-700 to-emerald-600 rounded-3xl p-10 text-white text-center"
            >
              <div className="text-5xl mb-4">📅</div>
              <h2 className="text-2xl font-black mb-3">Ready to Book Your Experience?</h2>
              <p className="text-green-100 mb-6 max-w-xl mx-auto">
                Add activities to your farm stay booking or book activities standalone.
                Our AI recommender helps you find the perfect combination.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <button
                  onClick={() => navigate("/places")}
                  className="bg-white text-green-700 font-bold px-8 py-3 rounded-2xl hover:bg-green-50 transition hover:scale-105 shadow-xl"
                >
                  Browse Farm Stays 🌾
                </button>
                <button
                  onClick={() => navigate("/recommendation")}
                  className="bg-green-800 hover:bg-green-900 text-white font-bold px-8 py-3 rounded-2xl transition hover:scale-105 border border-green-500"
                >
                  Get AI Recommendation 🧠
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <ActivitiesFooter />
    </motion.div>
  );
}