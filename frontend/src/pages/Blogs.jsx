import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";

/* ============================================================
   FOOTER LINKS
============================================================ */
const FOOTER_LINKS = {
  Explore: [
    { label: "Destinations",     to: "/places"           },
    { label: "Culture",          to: "/culture"          },
    { label: "Activities",       to: "/activities"       },
    { label: "Book Now",         to: "/book-now"         },
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
    { label: "My Dashboard",     to: "/dashboard"        },
    { label: "Admin Panel",      to: "/admin-dashboard"  },
  ],
};

const CATEGORIES = ["All", "Farming", "Technology", "Culture", "Travel", "Sustainability"];

/* ============================================================
   FOOTER
============================================================ */
function BlogsFooter() {
  return (
    <footer className="bg-gray-950 text-white pt-16 pb-8 mt-auto">
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
              Stay informed with the latest news, trends and insights
              from Indian agriculture and agrotourism — curated from
              trusted sources across the web.
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
            <Link to="/blogs" className="hover:text-green-400 transition-colors">All Blogs</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   BLOG CARD
============================================================ */
function BlogCard({ article, index, featured = false }) {
  const image =
    article.image ||
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80";

  if (featured) {
    return (
      <motion.a
        href={article.url}
        target="_blank"
        rel="noreferrer"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="group col-span-full md:col-span-2 relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 block"
        style={{ minHeight: "380px" }}
      >
        <img
          src={image}
          alt={article.title}
          className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block">
            Featured
          </span>
          <h2
            className="text-2xl md:text-3xl font-black text-white mb-3 leading-tight group-hover:text-green-300 transition-colors"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {article.title}
          </h2>
          <p className="text-gray-300 text-sm line-clamp-2 mb-4">
            {article.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs">
              {article.source?.name || "Agriculture News"}
            </span>
            <span className="bg-white/10 backdrop-blur-sm text-white text-xs px-4 py-2 rounded-full group-hover:bg-green-600 transition-colors font-semibold">
              Read More →
            </span>
          </div>
        </div>
      </motion.a>
    );
  }

  return (
    <motion.a
      href={article.url}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 3) * 0.08 }}
      whileHover={{ y: -6 }}
      className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-200 flex-shrink-0">
        <img
          src={image}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80";
          }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        {article.source?.name && (
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 backdrop-blur-sm text-green-700 text-xs font-bold px-3 py-1 rounded-full">
              {article.source.name}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3
          className="font-black text-gray-900 text-base mb-2 line-clamp-2 group-hover:text-green-700 transition-colors leading-snug flex-1"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {article.title}
        </h3>
        <p className="text-gray-500 text-xs leading-relaxed line-clamp-3 mb-4">
          {article.description || "No description available."}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            {article.publishedAt
              ? new Date(article.publishedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "Recent"}
          </span>
          <span className="text-xs text-green-600 font-bold group-hover:underline">
            Read →
          </span>
        </div>
      </div>
    </motion.a>
  );
}

/* ============================================================
   MAIN PAGE
============================================================ */
const Blogs = () => {
  const [articles, setArticles]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(9);
  const navigate = useNavigate();

  const API_KEY = "c6fe05940fa2f93de9f77b2a362f69e7";

  /* ---- Existing fetch logic preserved ---- */
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://gnews.io/api/v4/search?q=agriculture+india&lang=en&country=in&max=20&apikey=${API_KEY}`
        );
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  /* ---- Filter ---- */
  const filtered = articles.filter((a) => {
    const q = search.toLowerCase();
    return (
      !q ||
      a.title?.toLowerCase().includes(q) ||
      a.description?.toLowerCase().includes(q)
    );
  });

  const visible  = filtered.slice(0, visibleCount);
  const hasMore  = visibleCount < filtered.length;
  const featured = visible[0];
  const rest     = visible.slice(1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen bg-gray-50"
    >
      <Navbar />

      {/* ===== HERO ===== */}
      <div className="mt-16 relative overflow-hidden bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900 text-white">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&q=60')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-green-900/80" />

        <div className="relative max-w-5xl mx-auto px-6 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-green-500/20 backdrop-blur-sm border border-green-400/30 text-xs font-bold px-4 py-2 rounded-full mb-5 uppercase tracking-widest inline-block"
          >
            📰 Agriculture News & Insights
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl font-black mb-4 leading-tight"
            style={{ fontFamily: "Georgia, serif" }}
          >
            AgroVista
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-200">
              Blogs & News
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-green-100 max-w-xl mx-auto text-lg mb-8"
          >
            Stay updated with the latest trends, innovations and stories
            from Indian agriculture and agrotourism
          </motion.p>

          {/* Hero search */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative max-w-md mx-auto"
          >
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search articles..."
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
              { label: "Articles",   value: articles.length, emoji: "📰" },
              { label: "Live News",  value: "Real-time",     emoji: "⚡" },
              { label: "Language",   value: "English",       emoji: "🌐" },
              { label: "Region",     value: "India",         emoji: "🇮🇳" },
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
      <div className="flex-grow max-w-6xl mx-auto w-full px-4 md:px-6 py-10">

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-green-600 text-white border-green-600 shadow-md"
                  : "bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
              className="w-12 h-12 border-4 border-green-100 border-t-green-600 rounded-full"
            />
            <p className="text-gray-500">Loading latest agriculture news...</p>
          </div>
        )}

        {/* Articles grid */}
        {!loading && filtered.length > 0 && (
          <>
            {/* Featured + first 3 */}
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {featured && (
                <BlogCard article={featured} index={0} featured={true} />
              )}
              {rest.slice(0, 3).map((article, i) => (
                <BlogCard key={i} article={article} index={i} />
              ))}
            </div>

            {/* Rest of articles */}
            {rest.length > 3 && (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                {rest.slice(3).map((article, i) => (
                  <BlogCard key={i + 3} article={article} index={i + 3} />
                ))}
              </div>
            )}

            {/* Load more */}
            {hasMore && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setVisibleCount((c) => c + 6)}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold px-10 py-4 rounded-2xl transition-all hover:scale-105 shadow-lg"
                >
                  Load More Articles ({filtered.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-24">
            <div className="text-7xl mb-4">📰</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              No articles found
            </h3>
            <p className="text-gray-500 mb-4">
              Try a different search term
            </p>
            <button
              onClick={() => setSearch("")}
              className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition"
            >
              Show All Articles
            </button>
          </div>
        )}

        {/* CTA */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 bg-gradient-to-r from-green-700 to-emerald-600 rounded-3xl p-10 text-white text-center"
          >
            <div className="text-5xl mb-4">🌾</div>
            <h2 className="text-2xl font-black mb-3">
              Ready to Experience Agrotourism?
            </h2>
            <p className="text-green-100 mb-6 max-w-xl mx-auto">
              Stop reading about it — start living it. Book your authentic
              farm experience across rural India today.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => navigate("/places")}
                className="bg-white text-green-700 font-bold px-8 py-3 rounded-2xl hover:bg-green-50 transition hover:scale-105 shadow-xl"
              >
                Browse Destinations 🗺️
              </button>
              <button
                onClick={() => navigate("/recommendation")}
                className="bg-green-800 hover:bg-green-900 text-white font-bold px-8 py-3 rounded-2xl transition hover:scale-105 border border-green-500"
              >
                Plan My Trip 🧠
              </button>
            </div>
          </motion.div>
        )}
      </div>

      <BlogsFooter />
    </motion.div>
  );
};

export default Blogs;