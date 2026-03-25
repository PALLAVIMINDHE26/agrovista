import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";

const CATEGORY_CONFIG = {
  Outdoor:  { color: "bg-green-100 text-green-800",  icon: "🌿", bg: "from-green-500 to-emerald-600" },
  Workshop: { color: "bg-blue-100 text-blue-800",    icon: "🎨", bg: "from-blue-500 to-indigo-600"  },
  Cultural: { color: "bg-orange-100 text-orange-800", icon: "🎭", bg: "from-orange-500 to-amber-600" },
};

const DIFFICULTY_CONFIG = {
  Easy:     { color: "bg-green-100 text-green-700",  label: "Suitable for everyone" },
  Moderate: { color: "bg-amber-100 text-amber-700",  label: "Some physical activity" },
  Hard:     { color: "bg-red-100 text-red-700",      label: "Physically demanding"   },
};

export default function ActivityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity]   = useState(null);
  const [reviews, setReviews]     = useState([]);
  const [rating, setRating]       = useState(5);
  const [review, setReview]       = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [lightbox, setLightbox]   = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/activities/${id}`)
      .then((res) => setActivity(res.data))
      .catch(console.error);
    axios.get(`http://localhost:5000/api/activities/${id}/reviews`)
      .then((res) => setReviews(res.data))
      .catch(console.error);
  }, [id]);

  if (!activity) return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
        className="w-12 h-12 border-4 border-green-100 border-t-green-600 rounded-full"
      />
    </div>
  );

  const cat  = CATEGORY_CONFIG[activity.category]   || CATEGORY_CONFIG.Outdoor;
  const diff = DIFFICULTY_CONFIG[activity.difficulty] || DIFFICULTY_CONFIG.Easy;
  const allImages = [
    ...(Array.isArray(activity.image_url) ? activity.image_url : [activity.image_url]),
    ...(activity.gallery_images || []),
  ].filter(Boolean);

  const handleSubmitReview = async () => {
    await axios.post(`http://localhost:5000/api/activities/${activity.id}/rate`, {
      user_id: localStorage.getItem("userId"),
      rating,
      review,
    });
    setSubmitted(true);
    setReview("");
  };

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
              alt={activity.title}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full object-cover cursor-zoom-in"
              onClick={() => setLightbox(activeImg)}
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200";
              }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

          {allImages.length > 1 && (
            <>
              <button onClick={() => setActiveImg(i => (i - 1 + allImages.length) % allImages.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/40 backdrop-blur-sm rounded-full text-white text-2xl hover:bg-black/60 transition flex items-center justify-center">
                ‹
              </button>
              <button onClick={() => setActiveImg(i => (i + 1) % allImages.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/40 backdrop-blur-sm rounded-full text-white text-2xl hover:bg-black/60 transition flex items-center justify-center">
                ›
              </button>
            </>
          )}

          <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
            📷 {activeImg + 1} / {allImages.length}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${cat.color}`}>
                {cat.icon} {activity.category}
              </span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${diff.color}`}>
                {activity.difficulty}
              </span>
              {activity.average_rating > 0 && (
                <span className="bg-amber-400 text-white text-xs font-bold px-3 py-1 rounded-full">
                  ⭐ {Number(activity.average_rating).toFixed(1)} / 5
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white" style={{ fontFamily: "Georgia, serif" }}>
              {activity.title}
            </h1>
          </div>
        </div>

        {/* Thumbnails */}
        {allImages.length > 1 && (
          <div className="flex gap-2 p-4 bg-gray-50 overflow-x-auto">
            {allImages.map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)}
                className={`flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                  i === activeImg ? "border-green-500 scale-105" : "border-transparent opacity-60 hover:opacity-100"
                }`}>
                <img src={img} alt="" className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=200"; }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ===== CONTENT ===== */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* Left — main content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Quick meta */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: "⏳", label: "Duration",   value: activity.duration    },
                { icon: "💰", label: "Price",      value: `₹${Number(activity.price).toLocaleString()}/person` },
                { icon: "👥", label: "Group Size", value: activity.group_size || "4–20 people" },
                { icon: "📍", label: "Location",   value: activity.location_type || "Farm" },
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-lg mb-1">{item.icon}</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">{item.label}</p>
                  <p className="font-bold text-gray-800 text-sm mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7">
              <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <span>📋</span> About This Experience
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {activity.full_description || activity.short_description}
              </p>
            </div>

            {/* Why participate */}
            {activity.why_participate && (
              <div className="bg-green-50 rounded-3xl border border-green-100 p-7">
                <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                  <span>🎯</span> Why Join This Activity?
                </h2>
                <p className="text-gray-700 leading-relaxed">{activity.why_participate}</p>
              </div>
            )}

            {/* Benefits */}
            {activity.benefits && activity.benefits.length > 0 && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7">
                <h2 className="text-xl font-black text-gray-900 mb-5 flex items-center gap-2">
                  <span>✨</span> What You Will Gain
                </h2>
                <div className="space-y-3">
                  {activity.benefits.map((benefit, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-start gap-3"
                    >
                      <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${cat.bg} flex items-center justify-center text-white text-xs flex-shrink-0 mt-0.5`}>
                        ✓
                      </div>
                      <span className="text-gray-700 text-sm leading-relaxed">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Included */}
            {activity.included && activity.included.length > 0 && (
              <div className="bg-blue-50 rounded-3xl border border-blue-100 p-7">
                <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                  <span>🎁</span> What''s Included
                </h2>
                <div className="grid sm:grid-cols-2 gap-2">
                  {activity.included.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-blue-500">✓</span> {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suitable for / Not suitable */}
            <div className="grid sm:grid-cols-2 gap-4">
              {activity.suitable_for && activity.suitable_for.length > 0 && (
                <div className="bg-green-50 rounded-2xl p-5">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span>👍</span> Suitable For
                  </h3>
                  <ul className="space-y-1">
                    {activity.suitable_for.map((s, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                        <span className="text-green-500 text-xs">●</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {activity.not_suitable_for && (
                <div className="bg-red-50 rounded-2xl p-5">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span>⚠️</span> Not Suitable For
                  </h3>
                  <p className="text-sm text-gray-700">{activity.not_suitable_for}</p>
                </div>
              )}
            </div>

            {/* What to bring */}
            {activity.what_to_bring && activity.what_to_bring.length > 0 && (
              <div className="bg-amber-50 rounded-3xl border border-amber-100 p-7">
                <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                  <span>🎒</span> What to Bring
                </h2>
                <div className="grid sm:grid-cols-2 gap-2">
                  {activity.what_to_bring.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-amber-500">→</span> {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7">
              <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <span>⭐</span> Visitor Reviews
                <span className="ml-auto text-sm font-normal text-gray-400">
                  {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                </span>
              </h2>

              {reviews.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No reviews yet — be the first!</p>
              ) : (
                <div className="space-y-4 mb-8">
                  {reviews.map((r) => (
                    <div key={r.id} className="bg-gray-50 rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[1,2,3,4,5].map((n) => (
                            <span key={n} className={`text-sm ${n <= r.rating ? "text-amber-400" : "text-gray-200"}`}>★</span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(r.created_at).toLocaleDateString("en-IN")}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm">{r.review}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Review form */}
              {!submitted ? (
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="font-bold text-gray-900 mb-4">Share Your Experience</h3>
                  <div className="flex gap-2 mb-4">
                    {[1,2,3,4,5].map((n) => (
                      <button key={n} onClick={() => setRating(n)}
                        className={`text-3xl transition-transform hover:scale-125 ${n <= rating ? "text-amber-400" : "text-gray-200"}`}>
                        ★
                      </button>
                    ))}
                  </div>
                  <textarea
                    placeholder="What did you enjoy most about this activity?"
                    className="w-full border-2 border-gray-200 rounded-2xl p-4 text-sm focus:outline-none focus:border-green-400 resize-none mb-4"
                    rows={4}
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                  />
                  <button
                    onClick={handleSubmitReview}
                    className="bg-green-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-green-700 transition"
                  >
                    Submit Review ✓
                  </button>
                </div>
              ) : (
                <div className="bg-green-50 rounded-2xl p-4 text-center text-green-700 font-semibold mt-4">
                  ✅ Thank you for your review! It will appear after approval.
                </div>
              )}
            </div>
          </div>

          {/* Right — booking sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">

              {/* Booking card */}
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className={`bg-gradient-to-r ${cat.bg} p-6 text-white`}>
                  <p className="text-white/70 text-sm mb-1">Price per person</p>
                  <p className="text-4xl font-black">₹{Number(activity.price).toLocaleString()}</p>
                  <p className="text-white/70 text-xs mt-1">GST extra · {activity.duration}</p>
                </div>

                <div className="p-6 space-y-4">
                  {[
                    { icon: "⏳", label: "Duration",    value: activity.duration           },
                    { icon: "🎯", label: "Difficulty",   value: activity.difficulty          },
                    { icon: "👥", label: "Group Size",   value: activity.group_size           },
                    { icon: "🌤️", label: "Best Season",  value: activity.season               },
                    { icon: "📍", label: "Setting",      value: activity.location_type        },
                  ].map((item, i) => item.value && (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-lg">{item.icon}</span>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide">{item.label}</p>
                        <p className="text-sm font-semibold text-gray-800">{item.value}</p>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => navigate(`/book-now${id ? `/${id}` : ""}`)}
                    className={`w-full bg-gradient-to-r ${cat.bg} text-white font-black py-4 rounded-2xl transition-all hover:scale-105 hover:shadow-xl mt-2`}
                  >
                    Book This Activity 🌾
                  </button>

                  <button
                    onClick={() => navigate("/chatbot")}
                    className="w-full border-2 border-gray-200 text-gray-600 font-bold py-3 rounded-2xl hover:bg-gray-50 transition text-sm"
                  >
                    🤖 Ask AI Chatbot
                  </button>
                </div>
              </div>

              {/* Highlight */}
              {activity.highlight && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                  <p className="text-xs font-bold text-green-700 uppercase tracking-wide mb-1">✨ Signature Highlight</p>
                  <p className="text-green-800 text-sm font-semibold">{activity.highlight}</p>
                </div>
              )}

              {/* Trust */}
              <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2.5">
                {[
                  "✅ Instant booking confirmation",
                  "🔄 Free cancellation 48hrs prior",
                  "🌿 Expert local guides only",
                  "💬 24/7 support available",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate("/activities")}
                className="w-full border-2 border-gray-200 text-gray-500 font-semibold py-3 rounded-2xl hover:bg-gray-50 transition text-sm"
              >
                ← Back to All Activities
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-4 right-4 text-white text-4xl">×</button>
            <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl"
              onClick={(e) => { e.stopPropagation(); setLightbox(i => (i - 1 + allImages.length) % allImages.length); }}>‹</button>
            <img src={allImages[lightbox]} alt="" className="max-h-[90vh] max-w-full object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()} />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl"
              onClick={(e) => { e.stopPropagation(); setLightbox(i => (i + 1) % allImages.length); }}>›</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-gray-950 text-white py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <Link to="/" className="text-green-400 font-black text-lg">AgroVista 🌿</Link>
          <div className="flex gap-6">
            <Link to="/activities" className="hover:text-green-400 transition">All Activities</Link>
            <Link to="/places"     className="hover:text-green-400 transition">Destinations</Link>
            <Link to="/book-now"   className="hover:text-green-400 transition">Book Now</Link>
          </div>
          <span>© 2026 AgroVista</span>
        </div>
      </footer>
    </motion.div>
  );
}