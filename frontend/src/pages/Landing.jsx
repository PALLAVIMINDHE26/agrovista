import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform , AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import MainLayout from "../layouts/MainLayout";

/* ============================================================
   DATA
============================================================ */
const GALLERY = [
  {
    src: "https://www.global-agriculture.com/wp-content/uploads/2025/02/Untitled-1-Recovered-768x427.jpg",
    label: "Punjab Wheat Fields",
    state: "Punjab",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0354/9161/0668/files/spice-plantation_1024x1024.jpg?v=1607845874",
    label: "Kerala Spice Farms",
    state: "Kerala",
  },
  {
    src: "https://media.odynovotours.com/article/78000/thar-desert-sunset-title_75675.jpg",
    label: "Rajasthan Desert Farms",
    state: "Rajasthan",
  },
  {
    src: "https://im.whatshot.in/img/2023/Feb/collage-maker-27-feb-2023-0707-pm-1677505050.jpg",
    label: "Coorg Coffee Estates",
    state: "Karnataka",
  },
  {
    src: "https://teafloor.com/blog/wp-content/uploads/2018/10/Tea-garden-in-assam-1-1.png",
    label: "Assam Tea Gardens",
    state: "Assam",
  },
  {
    src: "https://www.mumbaipuneadventures.com/wp-content/uploads/2023/01/sula-website-1200x675.jpg",
    label: "Maharashtra Vineyards",
    state: "Maharashtra",
  },
];

const FEATURES = [
  {
    icon: "🌾",
    title: "Agrotourism Destinations",
    text: "Discover 50+ handpicked farm stays across 28 Indian states.",
    link: "/places",
    color: "from-green-400 to-emerald-600",
  },
  {
    icon: "🎉",
    title: "Culture & Festivals",
    text: "Immerse yourself in India's rich harvest traditions.",
    link: "/culture",
    color: "from-orange-400 to-amber-600",
  },
  {
    icon: "🤖",
    title: "AI Chatbot",
    text: "Get instant answers about destinations and farming.",
    link: "/chatbot",
    color: "from-blue-400 to-indigo-600",
  },
  {
    icon: "🌿",
    title: "Disease Detector",
    text: "Upload a leaf photo — AI diagnoses plant diseases instantly.",
    link: "/disease-detector",
    color: "from-teal-400 to-green-600",
  },
  {
    icon: "🧠",
    title: "AI Recommender",
    text: "Answer 6 questions and get your perfect trip planned.",
    link: "/recommendation",
    color: "from-purple-400 to-violet-600",
  },
  {
    icon: "🦜",
    title: "Bird Watching",
    text: "Explore rare bird species found near Indian agro farms.",
    link: "/birds",
    color: "from-sky-400 to-cyan-600",
  },
];

const TESTIMONIALS = [
  {
    name: "Priya Gupta",
    location: "Mumbai",
    text: "AgroVista changed how I travel. The Kerala spice farm was absolutely magical — we picked pepper, cardamom and cooked with local farmers!",
    avatar: "PG",
    rating: 5,
  },
  {
    name: "Saima Khan",
    location: "Mumbai",
    text: "Booked a weekend retreat in Punjab. The bullock cart rides and fresh harvest lunch were memories our family will cherish forever.",
    avatar: "SK",
    rating: 5,
  },
  {
    name: "Ananya Krishnan",
    location: "Bangalore",
    text: "The AI disease detector saved my entire terrace garden! Diagnosed late blight in seconds and suggested the right treatment.",
    avatar: "AK",
    rating: 5,
  },
];

const QUICK_LINKS = [
  { label: "Destinations", link: "/places", emoji: "🗺️" },
  { label: "Culture", link: "/culture", emoji: "🎭" },
  { label: "Activities", link: "/activities", emoji: "🎯" },
  { label: "Book Now", link: "/book-now", emoji: "📅" },
  { label: "AI Chatbot", link: "/chatbot", emoji: "🤖" },
  { label: "Disease Detector", link: "/disease-detector", emoji: "🌿" },
  { label: "Blogs", link: "/blogs", emoji: "📝" },
  { label: "Birds", link: "/birds", emoji: "🦜" },
];

/* ============================================================
   HERO SECTION
============================================================ */
function Hero() {
  const navigate = useNavigate();
  const [currentBg, setCurrentBg] = useState(0);

  const heroImages = [
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=90",
    "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1600&q=90",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=90",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background slideshow */}
      <AnimatePresence>
        <motion.div
          key={currentBg}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${heroImages[currentBg]}')` }}
        />
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-green-300 rounded-full opacity-60"
          style={{
            left: `${10 + i * 8}%`,
            top: `${20 + (i % 4) * 20}%`,
          }}
          animate={{
            y: [-10, 10, -10],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + i * 0.4,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-block bg-green-500/20 backdrop-blur-sm border border-green-400/30 text-green-300 text-sm px-4 py-2 rounded-full mb-6 font-medium"
        >
          🌿 India's #1 Agrotourism Platform
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl font-black mb-6 leading-tight"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Experience
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
            Rural India
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Discover authentic farm stays, harvest festivals, and AI-powered
          agricultural experiences across 28 Indian states.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => navigate("/places")}
            className="bg-green-500 hover:bg-green-400 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/30"
          >
            Explore Destinations 🗺️
          </button>
          <button
            onClick={() => navigate("/recommendation")}
            className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105"
          >
            Plan My Trip 🧠
          </button>
        </motion.div>

        {/* Slide indicators */}
        <div className="flex justify-center gap-2 mt-10">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentBg(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentBg ? "w-8 bg-green-400" : "w-2 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 flex flex-col items-center gap-1"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-white/40" />
      </motion.div>
    </div>
  );
}

/* ============================================================
   QUICK LINKS BAR
============================================================ */
function QuickLinksBar() {
  return (
    <div className="bg-green-700 py-4 sticky top-16 z-40 shadow-lg">
      <div className="flex gap-2 px-6 overflow-x-auto scrollbar-hide justify-center flex-wrap">
        {QUICK_LINKS.map((item, i) => (
          <Link
            key={i}
            to={item.link}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 hover:scale-105 hover:shadow-lg"
          >
            <span>{item.emoji}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   STATS SECTION
============================================================ */
function StatsSection() {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    { end: 50, suffix: "+", label: "Destinations", emoji: "🗺️" },
    { end: 28, suffix: "+", label: "States Covered", emoji: "🇮🇳" },
    { end: 1200, suffix: "+", label: "Happy Visitors", emoji: "😊" },
    { end: 95, suffix: "%", label: "Satisfaction Rate", emoji: "⭐" },
  ];

  return (
    <section ref={ref} className="py-20 bg-gradient-to-r from-green-800 to-emerald-700">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.15 }}
            className="text-center text-white"
          >
            <div className="text-4xl mb-2">{s.emoji}</div>
            <div className="text-5xl font-black mb-1">
              {inView ? (
                <CountUp end={s.end} duration={2.5} />
              ) : "0"}
              {s.suffix}
            </div>
            <div className="text-green-200 font-medium">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   FEATURES SECTION
============================================================ */
function FeaturesSection() {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-green-600 font-semibold text-sm uppercase tracking-widest">
            Everything You Need
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-3 mb-4">
            Explore All Features
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            From AI-powered tools to cultural experiences — AgroVista has it all
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => navigate(f.link)}
              className="bg-white rounded-3xl shadow-lg overflow-hidden cursor-pointer group hover:shadow-2xl transition-all duration-300"
            >
              {/* Gradient top bar */}
              <div className={`h-2 bg-gradient-to-r ${f.color}`} />
              <div className="p-8">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-2xl mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {f.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  {f.text}
                </p>
                <span className="text-green-600 font-semibold text-sm group-hover:gap-3 flex items-center gap-2 transition-all duration-200">
                  Explore →
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   GALLERY SLIDER
============================================================ */
function GallerySection() {
  const [active, setActive] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef(null);

  const startAutoplay = () => {
    intervalRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % GALLERY.length);
    }, 3000);
  };

  useEffect(() => {
    if (isPlaying) startAutoplay();
    return () => clearInterval(intervalRef.current);
  }, [isPlaying]);

  const goTo = (i) => {
    setActive(i);
    clearInterval(intervalRef.current);
    if (isPlaying) startAutoplay();
  };

  const prev = () => goTo((active - 1 + GALLERY.length) % GALLERY.length);
  const next = () => goTo((active + 1) % GALLERY.length);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-green-600 font-semibold text-sm uppercase tracking-widest">
            Visual Journey
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-3">
            Gallery of Rural India
          </h2>
        </motion.div>

        <div className="relative">
          {/* Main Display */}
          <div className="grid md:grid-cols-5 gap-4 h-[480px]">

            {/* Big featured image */}
            <div className="md:col-span-3 relative rounded-3xl overflow-hidden shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.img
                  key={active}
                  src={GALLERY[active].src}
                  alt={GALLERY[active].label}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Label overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <motion.div
                  key={active + "label"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-white"
                >
                  <p className="text-xs text-green-300 font-semibold uppercase tracking-widest mb-1">
                    {GALLERY[active].state}
                  </p>
                  <p className="text-xl font-bold">{GALLERY[active].label}</p>
                </motion.div>
              </div>

              {/* Prev / Next */}
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition"
              >
                ‹
              </button>
              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition"
              >
                ›
              </button>
            </div>

            {/* Thumbnail strip */}
            <div className="md:col-span-2 flex flex-col gap-3 overflow-hidden">
              {GALLERY.map((item, i) => (
                <motion.div
                  key={i}
                  onClick={() => goTo(i)}
                  whileHover={{ scale: 1.02 }}
                  className={`relative flex-1 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                    i === active
                      ? "ring-3 ring-green-500 shadow-lg"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={item.src}
                    alt={item.label}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 transition-all duration-300 ${
                    i === active ? "bg-green-500/20" : "bg-black/20"
                  }`} />
                  <div className="absolute bottom-2 left-3 text-white text-xs font-semibold">
                    {item.label}
                  </div>
                  {i === active && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Dot indicators + controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-sm text-gray-500 hover:text-green-600 transition flex items-center gap-1"
            >
              {isPlaying ? "⏸ Pause" : "▶ Play"}
            </button>
            <div className="flex gap-2">
              {GALLERY.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === active ? "w-6 bg-green-500" : "w-2 bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   TESTIMONIALS
============================================================ */
function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent(p => (p + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="py-24 bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-green-600 font-semibold text-sm uppercase tracking-widest">
            Real Stories
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-3">
            What Visitors Say 🌿
          </h2>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl shadow-xl p-10 text-center"
            >
              {/* Stars */}
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">★</span>
                ))}
              </div>

              <p className="text-gray-700 text-lg leading-relaxed mb-8 italic max-w-2xl mx-auto">
                "{TESTIMONIALS[current].text}"
              </p>

              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  {TESTIMONIALS[current].avatar}
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900">{TESTIMONIALS[current].name}</p>
                  <p className="text-gray-500 text-sm">{TESTIMONIALS[current].location}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-2 mt-6">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? "w-6 bg-green-500" : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   BLOGS PREVIEW
============================================================ */
function BlogsPreview() {
  const navigate = useNavigate();
  const blogs = [
    {
      title: "Top 5 Agro Destinations in India",
      desc: "Discover the best farm stays and rural tourism spots across India.",
      emoji: "🌾",
      tag: "Travel",
      color: "bg-green-50",
    },
    {
      title: "Why Agrotourism is Growing",
      desc: "Learn how rural tourism supports local farmers and communities.",
      emoji: "📈",
      tag: "Insights",
      color: "bg-amber-50",
    },
    {
      title: "Birdwatching in Indian Farms",
      desc: "Explore bird biodiversity near agricultural lands of India.",
      emoji: "🦜",
      tag: "Nature",
      color: "bg-sky-50",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-between items-end mb-14"
        >
          <div>
            <span className="text-green-600 font-semibold text-sm uppercase tracking-widest">
              Latest
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-2">
              Blogs & Insights 📝
            </h2>
          </div>
          <button
            onClick={() => navigate("/blogs")}
            className="text-green-600 font-semibold hover:underline hidden md:block"
          >
            View all blogs →
          </button>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {blogs.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              onClick={() => navigate("/blogs")}
              className={`${b.color} rounded-3xl p-8 cursor-pointer hover:shadow-xl transition-all duration-300 group`}
            >
              <div className="text-5xl mb-4">{b.emoji}</div>
              <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full uppercase tracking-wide">
                {b.tag}
              </span>
              <h3 className="font-black text-gray-900 text-xl mt-4 mb-3 group-hover:text-green-700 transition-colors">
                {b.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
              <div className="mt-4 text-green-600 text-sm font-semibold">
                Read more →
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CTA SECTION
============================================================ */
function CTASection() {
  const navigate = useNavigate();
  return (
    <section className="py-24 bg-gradient-to-br from-green-700 via-emerald-600 to-green-800 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-7xl mb-6">🌾</div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
            Ready to Experience <br />
            <span className="text-green-300">Rural India?</span>
          </h2>
          <p className="text-green-100 text-lg mb-10 max-w-2xl mx-auto">
            Join 1,200+ visitors who have discovered the magic of agrotourism.
            Your perfect farm experience is just a click away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/places")}
              className="bg-white text-green-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-green-50 transition-all hover:scale-105 shadow-xl"
            >
              Browse Destinations 🗺️
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="bg-green-500 hover:bg-green-400 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 border border-green-400"
            >
              Sign Up Free ✨
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================================
   FOOTER
============================================================ */
function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="bg-gray-950 text-white py-16">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <h2 className="text-2xl font-black text-green-400 mb-4">
            AgroVista 🌿
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            India's unified agrotourism platform integrating culture, nature & AI.
          </p>
          <div className="flex gap-3 mt-6">
            {["🦜", "📘", "📸", "▶️"].map((icon, i) => (
              <div key={i} className="w-9 h-9 bg-gray-800 hover:bg-green-700 rounded-full flex items-center justify-center cursor-pointer transition text-sm">
                {icon}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-gray-200 mb-4">Explore</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            {[
              { label: "Destinations", link: "/places" },
              { label: "Culture", link: "/culture" },
              { label: "Activities", link: "/activities" },
              { label: "Book Now", link: "/book-now" },
            ].map((item) => (
              <li key={item.label}>
                <button
                  onClick={() => navigate(item.link)}
                  className="hover:text-green-400 transition"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-gray-200 mb-4">AI Tools</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            {[
              { label: "AI Chatbot", link: "/chatbot" },
              { label: "Disease Detector", link: "/disease-detector" },
              { label: "Recommender", link: "/recommendation" },
              { label: "Bird Guide", link: "/birds" },
            ].map((item) => (
              <li key={item.label}>
                <button
                  onClick={() => navigate(item.link)}
                  className="hover:text-green-400 transition"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-gray-200 mb-4">Contact</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>📧 support@agrovista.com</li>
            <li>📞 +91 98765 43210</li>
            <li>📍 Rural India Network</li>
            <li>🕐 9 AM – 6 PM IST</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
        © 2026 AgroVista. Made with 🌿 for Rural India.
      </div>
    </footer>
  );
}

/* ============================================================
   MAIN LANDING PAGE
============================================================ */
export default function Landing() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* No MainLayout for hero — custom full screen */}
      <Hero />
      {/* <QuickLinksBar /> */}
      <StatsSection />
      <FeaturesSection />
      <GallerySection />
      <TestimonialsSection />
      <BlogsPreview />
      <CTASection />
      <Footer />
    </motion.div>
  );
}