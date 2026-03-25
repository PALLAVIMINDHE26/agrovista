import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";

/* ============================================================
   CONSTANTS
============================================================ */
const STATES = [
  "All States","Maharashtra","Kerala","Karnataka","Punjab","Rajasthan",
  "Himachal Pradesh","Uttarakhand","West Bengal","Assam","Tamil Nadu",
  "Goa","Andhra Pradesh","Telangana","Odisha","Madhya Pradesh","Gujarat",
  "Meghalaya","Nagaland","Sikkim","Arunachal Pradesh","Manipur","Mizoram",
  "Ladakh","Puducherry","Andaman & Nicobar Islands",
];

const SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "rating_desc", label: "Top Rated" },
  { value: "az", label: "A – Z" },
  { value: "za", label: "Z – A" },
];

const FOOTER_LINKS = {
  Explore: [
    { label: "Destinations",     to: "/places" },
    { label: "Culture",          to: "/culture" },
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
    { label: "My Dashboard",     to: "/dashboard" },
    { label: "Admin Panel",      to: "/admin-dashboard" },
  ],
};

/* ============================================================
   STAR RATING
============================================================ */
function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          className={`w-3.5 h-3.5 ${
            n <= Math.round(rating) ? "text-amber-400" : "text-gray-200"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-xs text-gray-500 font-medium">{rating}</span>
    </div>
  );
}

/* ============================================================
   PLACE CARD
============================================================ */
function PlaceCard({ place, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: (index % 3) * 0.1, duration: 0.45 }}
      whileHover={{ y: -8 }}
      className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden bg-gray-200">
        <img
          src={place.image_url}
          alt={place.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80";
          }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* State badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-green-700 text-xs font-bold px-3 py-1 rounded-full">
            📍 {place.state}
          </span>
        </div>

        {/* Rating badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-amber-400 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            ⭐ {place.rating}
          </span>
        </div>

        {/* Hover CTA */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white text-green-700 font-bold px-5 py-2.5 rounded-full text-sm shadow-xl">
            Explore →
          </div>
        </div>

        {/* Price range at bottom */}
        {place.price_range && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-green-600/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
              {place.price_range}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-base font-black text-gray-900 mb-1 group-hover:text-green-700 transition-colors leading-snug line-clamp-1">
          {place.name}
        </h3>

        <div className="flex items-center gap-2 mb-2">
          <Stars rating={place.rating} />
        </div>

        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4">
          {place.description}
        </p>

        {/* Features chips */}
        {place.highlights && place.highlights.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {place.highlights.slice(0, 2).map((h, i) => (
              <span
                key={i}
                className="bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-full border border-green-100"
              >
                {h}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {place.best_time && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              🗓️ {place.best_time?.split("–")[0].trim()}
            </span>
          )}
          <Link
            to={`/places/${place.id}`}
            className="ml-auto bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* ============================================================
   FOOTER
============================================================ */
function PlacesFooter() {
  return (
    <footer className="bg-gray-950 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-10 mb-12">
          <div className="md:col-span-2">
            <Link
              to="/"
              className="text-2xl font-black text-green-400 mb-4 block hover:text-green-300 transition-colors"
            >
              AgroVista 🌿
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              India's unified agrotourism platform connecting you to 60+
              authentic farm experiences across all 28 states.
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
              <h3 className="font-bold text-gray-200 mb-4 text-sm uppercase tracking-wider">
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
            <Link to="/places" className="hover:text-green-400 transition-colors">All Destinations</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   MAIN PAGE
============================================================ */
export default function Places() {
  const [places, setPlaces]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [sortOrder, setSortOrder]     = useState("");
  const [visibleCount, setVisibleCount] = useState(12);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/places")
      .then((res) => setPlaces(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  /* ---- filter + sort ---- */
  let filtered = places
    .filter((p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.state?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
    )
    .filter((p) => (stateFilter ? p.state === stateFilter : true));

  if (sortOrder === "rating_desc")
    filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  else if (sortOrder === "az")
    filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  else if (sortOrder === "za")
    filtered = [...filtered].sort((a, b) => b.name.localeCompare(a.name));

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const clearFilters = () => {
    setSearch("");
    setStateFilter("");
    setSortOrder("");
  };

  const hasFilters = search || stateFilter || sortOrder;

  /* ---- state stats ---- */
  const stateCount  = new Set(places.map((p) => p.state)).size;
  const avgRating   = places.length
    ? (places.reduce((s, p) => s + parseFloat(p.rating || 0), 0) / places.length).toFixed(1)
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
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=90"
          alt="Agrotourism Destinations"
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/80" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-bold px-4 py-2 rounded-full mb-4 uppercase tracking-widest"
          >
            🌾 60+ Destinations Across India
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-black mb-4 leading-tight"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Discover
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-200">
              Agrotourism India
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-200 max-w-2xl text-lg mb-8"
          >
            From Himalayan apple orchards to tropical spice farms — find
            your perfect rural India experience
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
              placeholder="Search destinations, states..."
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
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap gap-8 justify-center">
            {[
              { label: "Destinations", value: places.length, emoji: "🗺️" },
              { label: "States",        value: stateCount,    emoji: "🇮🇳" },
              { label: "Avg Rating",    value: avgRating,     emoji: "⭐" },
              { label: "Best Season",   value: "Oct–Mar",     emoji: "❄️" },
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
      <div className="flex-grow bg-gradient-to-br from-green-50/50 via-white to-emerald-50/30">
        <div className="max-w-7xl mx-auto px-6 py-10">

          {/* Filters row */}
          <div className="flex flex-wrap gap-3 mb-8 items-center">
            {/* State filter */}
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer shadow-sm"
            >
              {STATES.map((s) => (
                <option key={s} value={s === "All States" ? "" : s}>
                  {s}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer shadow-sm"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            {/* Results count */}
            <p className="text-sm text-gray-500 ml-auto">
              Showing{" "}
              <span className="font-bold text-gray-900">{Math.min(visibleCount, filtered.length)}</span>
              {" "}of{" "}
              <span className="font-bold text-gray-900">{filtered.length}</span>{" "}
              destinations
            </p>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-red-500 hover:underline"
              >
                Clear ×
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
              <p className="text-gray-500">Loading destinations...</p>
            </div>
          )}

          {/* Grid */}
          {!loading && visible.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {visible.map((place, i) => (
                <Link key={place.id} to={`/places/${place.id}`}>
                  <PlaceCard place={place} index={i} />
                </Link>
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
                No destinations found
              </h3>
              <p className="text-gray-500 mb-6">
                Try a different search or clear your filters
              </p>
              <button
                onClick={clearFilters}
                className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition"
              >
                Show All Destinations
              </button>
            </motion.div>
          )}

          {/* Load more */}
          {!loading && hasMore && (
            <div className="text-center mt-12">
              <button
                onClick={() => setVisibleCount((c) => c + 12)}
                className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-2xl font-bold text-base transition-all hover:scale-105 shadow-lg"
              >
                Load More Destinations ({filtered.length - visibleCount} remaining)
              </button>
            </div>
          )}

          {/* CTA banner */}
          {!loading && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-20 bg-gradient-to-r from-green-700 to-emerald-600 rounded-3xl p-10 text-white text-center"
            >
              <div className="text-5xl mb-4">🧠</div>
              <h2 className="text-2xl font-black mb-3">
                Not sure where to go?
              </h2>
              <p className="text-green-100 mb-6 max-w-xl mx-auto">
                Answer 6 quick questions and our AI will recommend the
                perfect agrotourism destination for you.
              </p>
              <button
                onClick={() => navigate("/recommendation")}
                className="bg-white text-green-700 font-bold px-8 py-3 rounded-2xl hover:bg-green-50 transition hover:scale-105 shadow-xl"
              >
                Get AI Recommendation →
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <PlacesFooter />
    </motion.div>
  );
}