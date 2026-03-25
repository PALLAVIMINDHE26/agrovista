import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";

export default function CultureDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [festival, setFestival] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/culture/${id}`)
      .then((res) => { setFestival(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
        className="w-12 h-12 border-4 border-orange-100 border-t-orange-500 rounded-full"
      />
    </div>
  );

  if (!festival) return (
    <div className="min-h-screen flex items-center justify-center text-gray-500">
      Festival not found.
    </div>
  );

  const allImages = [festival.image_url, ...(festival.gallery_images || [])].filter(Boolean);

  const sections = [
    { icon: "📖", title: "About the Festival",        key: "description" },
    { icon: "📜", title: "Historical Background",      key: "history" },
    { icon: "🙏", title: "Why It Is Celebrated",       key: "significance" },
    { icon: "🎭", title: "Rituals & Traditions",       key: "rituals" },
    { icon: "🌾", title: "Agricultural Importance",    key: "agricultural_importance" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col min-h-screen bg-white"
    >
      <Navbar />

      {/* ===== IMAGE GALLERY ===== */}
      <div className="mt-16">
        <div className="relative h-[480px] overflow-hidden bg-gray-200">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeImg}
              src={allImages[activeImg]}
              alt={festival.festival_name}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full object-cover cursor-zoom-in"
              onClick={() => setLightbox(activeImg)}
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1534759926685-7e4e6222b8e3?w=1200";
              }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

          {/* Prev/Next */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={() => setActiveImg((i) => (i - 1 + allImages.length) % allImages.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/40 backdrop-blur-sm rounded-full text-white text-2xl hover:bg-black/60 transition flex items-center justify-center"
              >‹</button>
              <button
                onClick={() => setActiveImg((i) => (i + 1) % allImages.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/40 backdrop-blur-sm rounded-full text-white text-2xl hover:bg-black/60 transition flex items-center justify-center"
              >›</button>
            </>
          )}

          {/* Counter */}
          <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
            📷 {activeImg + 1} / {allImages.length}
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                📍 {festival.state_name}
              </span>
              {festival.region && (
                <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                  {festival.region}
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: "Georgia, serif" }}>
              🎉 {festival.festival_name}
            </h1>
            {festival.best_time && (
              <p className="text-orange-200 mt-2">🗓️ {festival.best_time}</p>
            )}
          </div>
        </div>

        {/* Thumbnails */}
        {allImages.length > 1 && (
          <div className="flex gap-2 p-4 bg-orange-50 overflow-x-auto">
            {allImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                  i === activeImg ? "border-orange-500 scale-105" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1534759926685-7e4e6222b8e3?w=200"; }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ===== CONTENT ===== */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {sections.map((section) =>
              festival[section.key] ? (
                <motion.div
                  key={section.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl border border-orange-100 shadow-sm p-7"
                >
                  <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-2xl">{section.icon}</span>
                    {section.title}
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-[15px]">
                    {festival[section.key]}
                  </p>
                </motion.div>
              ) : null
            )}

            {/* Fun fact */}
            {festival.fun_fact && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-7"
              >
                <h2 className="text-xl font-black text-amber-800 mb-3 flex items-center gap-2">
                  <span>💡</span> Did You Know?
                </h2>
                <p className="text-amber-900 leading-relaxed">{festival.fun_fact}</p>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-5">

            {/* Quick facts */}
            <div className="bg-orange-50 rounded-3xl p-6 border border-orange-100">
              <h3 className="font-black text-gray-900 mb-4 text-lg">📋 Quick Facts</h3>
              <div className="space-y-3">
                {[
                  { label: "State",     value: festival.state_name,  icon: "📍" },
                  { label: "Region",    value: festival.region,      icon: "🗺️" },
                  { label: "Best Time", value: festival.best_time,   icon: "🗓️" },
                ].map((item, i) => item.value && (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">{item.label}</p>
                      <p className="font-semibold text-gray-800 text-sm">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Crops celebrated */}
            {festival.crops_celebrated && festival.crops_celebrated.length > 0 && (
              <div className="bg-green-50 rounded-3xl p-6 border border-green-100">
                <h3 className="font-black text-gray-900 mb-4 text-lg">🌾 Crops Celebrated</h3>
                <div className="flex flex-wrap gap-2">
                  {festival.crops_celebrated.map((crop, i) => (
                    <span key={i} className="bg-green-100 text-green-800 text-sm px-3 py-1.5 rounded-full font-medium border border-green-200">
                      {crop}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience this festival */}
            <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl p-6 text-white">
              <div className="text-3xl mb-3">🌾</div>
              <h3 className="font-black text-lg mb-2">Experience This Festival</h3>
              <p className="text-orange-100 text-sm mb-4 leading-relaxed">
                Book an agrotourism stay in {festival.state_name} timed with {festival.festival_name}!
              </p>
              <button
                onClick={() => navigate("/places")}
                className="w-full bg-white text-orange-700 font-bold py-3 rounded-2xl hover:bg-orange-50 transition text-sm"
              >
                Find Farm Stays →
              </button>
            </div>

            {/* Back */}
            <button
              onClick={() => navigate("/culture")}
              className="w-full border-2 border-gray-200 text-gray-600 font-semibold py-3 rounded-2xl hover:bg-gray-50 transition text-sm flex items-center justify-center gap-2"
            >
              ← Back to All Festivals
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-4 right-4 text-white text-4xl">×</button>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl"
              onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i - 1 + allImages.length) % allImages.length); }}
            >‹</button>
            <img
              src={allImages[lightbox]}
              alt=""
              className="max-h-[90vh] max-w-full object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl"
              onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i + 1) % allImages.length); }}
            >›</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-gray-950 text-white py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <Link to="/" className="text-green-400 font-black text-lg">AgroVista 🌿</Link>
          <div className="flex gap-6">
            <Link to="/culture" className="hover:text-orange-400 transition">All Festivals</Link>
            <Link to="/places"  className="hover:text-orange-400 transition">Destinations</Link>
            <Link to="/chatbot" className="hover:text-orange-400 transition">AI Chatbot</Link>
          </div>
          <span>© 2026 AgroVista</span>
        </div>
      </footer>
    </motion.div>
  );
}