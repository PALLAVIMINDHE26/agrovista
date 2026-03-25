import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Navbar from "../components/Navbar";

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map((n) => (
        <svg key={n} className={`w-5 h-5 ${n <= Math.round(rating) ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
      <span className="ml-1 text-gray-600 font-semibold">{rating}</span>
    </div>
  );
}

export default function PlaceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/places/${id}`)
      .then((res) => setPlace(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!place) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-green-100 border-t-green-600 rounded-full animate-spin" />
    </div>
  );

  const allImages = [
    place.image_url,
    ...(place.gallery_images || []),
  ].filter(Boolean);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <div className="mt-16">

        {/* ===== IMAGE GALLERY ===== */}
        <div className="relative">
          {/* Main image */}
          <div className="relative h-[500px] overflow-hidden bg-gray-200">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImg}
                src={allImages[activeImg]}
                alt={place.name}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full object-cover cursor-zoom-in"
                onClick={() => setLightbox(activeImg)}
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200";
                }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

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

            {/* Image counter */}
            <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
              📷 {activeImg + 1} / {allImages.length}
            </div>
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-2 p-4 bg-gray-50 overflow-x-auto">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    i === activeImg ? "border-green-500 scale-105" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=200"; }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ===== CONTENT ===== */}
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid lg:grid-cols-3 gap-10">

            {/* Left — main info */}
            <div className="lg:col-span-2 space-y-8">

              {/* Title */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                    📍 {place.state}
                    {place.district && `, ${place.district}`}
                  </span>
                  {place.best_time && (
                    <span className="bg-amber-50 text-amber-700 text-xs font-bold px-3 py-1 rounded-full">
                      🗓️ {place.best_time}
                    </span>
                  )}
                </div>
                <h1 className="text-4xl font-black text-gray-900 mb-3" style={{ fontFamily: "Georgia, serif" }}>
                  {place.name}
                </h1>
                <Stars rating={place.rating} />
              </div>

              {/* Description */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h2 className="font-bold text-gray-900 text-lg mb-3">About This Experience</h2>
                <p className="text-gray-700 leading-relaxed">{place.description}</p>
              </div>

              {/* Highlights */}
              {place.highlights && place.highlights.length > 0 && (
                <div>
                  <h2 className="font-bold text-gray-900 text-lg mb-4">✨ Highlights</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {place.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-3 bg-green-50 rounded-xl p-3">
                        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">✓</div>
                        <span className="text-gray-800 text-sm font-medium">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Activities */}
              {place.activities_available && place.activities_available.length > 0 && (
                <div>
                  <h2 className="font-bold text-gray-900 text-lg mb-4">🎯 Activities Available</h2>
                  <div className="flex flex-wrap gap-2">
                    {place.activities_available.map((a, i) => (
                      <span key={i} className="bg-blue-50 text-blue-700 text-sm px-4 py-2 rounded-full border border-blue-100 font-medium">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Map */}
              {place.latitude && place.longitude && (
                <div>
                  <h2 className="font-bold text-gray-900 text-lg mb-4">📍 Location</h2>
                  <MapContainer
                    center={[place.latitude, place.longitude]}
                    zoom={12}
                    className="h-72 w-full rounded-2xl shadow-lg overflow-hidden"
                  >
                    <TileLayer
                      attribution="&copy; OpenStreetMap"
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[place.latitude, place.longitude]}>
                      <Popup>{place.name}</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              )}
            </div>

            {/* Right — booking card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-6 text-white">
                  <p className="text-green-100 text-sm mb-1">Starting from</p>
                  <p className="text-3xl font-black">{place.price_range || "₹999"}</p>
                  <p className="text-green-100 text-xs mt-1">per person · GST extra</p>
                </div>

                <div className="p-6 space-y-4">
                  {[
                    { icon: "🗓️", label: "Best Time",       value: place.best_time },
                    { icon: "🚗", label: "Distance",         value: place.distance_from_city },
                    { icon: "⭐", label: "Rating",           value: `${place.rating} / 5.0` },
                    { icon: "📍", label: "Location",         value: `${place.district || ""} ${place.state}` },
                  ].map((item, i) => item.value && (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-lg">{item.icon}</span>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide">{item.label}</p>
                        <p className="text-sm font-semibold text-gray-800">{item.value}</p>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => navigate(`/booknow/${place.id}`)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl transition-all hover:scale-105 shadow-lg mt-2"
                  >
                    Book This Experience 🌾
                  </button>

                  <button
                    onClick={() => navigate("/chatbot")}
                    className="w-full border-2 border-green-200 text-green-700 font-bold py-3 rounded-2xl hover:bg-green-50 transition-colors text-sm"
                  >
                    🤖 Ask AI Chatbot
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== LIGHTBOX ===== */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition">×</button>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-gray-300"
              onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i - 1 + allImages.length) % allImages.length); }}
            >‹</button>
            <img
              src={allImages[lightbox]}
              alt=""
              className="max-h-[90vh] max-w-full object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-gray-300"
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
            <Link to="/places" className="hover:text-green-400 transition">All Destinations</Link>
            <Link to="/book-now" className="hover:text-green-400 transition">Book Now</Link>
            <Link to="/chatbot" className="hover:text-green-400 transition">AI Chatbot</Link>
          </div>
          <span>© 2026 AgroVista</span>
        </div>
      </footer>
    </div>
  );
}