import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import Navbar from "../components/Navbar";

/* ============================================================
   PACKAGES DATA
============================================================ */
const PACKAGES = [
  {
    id: 1,
    title: "Sunrise Day Visit",
    duration: "1 Day · 7 AM – 7 PM",
    price: 999,
    color: "from-amber-400 to-orange-500",
    lightColor: "bg-amber-50",
    borderColor: "border-amber-300",
    textColor: "text-amber-700",
    icon: "🌅",
    popular: false,
    features: [
      "Guided farm tour (3 hours)",
      "Organic farm-to-table lunch",
      "Bullock cart / tractor ride",
      "Activity participation (1 choice)",
      "Welcome drink & snacks",
    ],
  },
  {
    id: 2,
    title: "Harvest Overnight",
    duration: "1 Night · 2 Days",
    price: 2499,
    color: "from-green-500 to-emerald-600",
    lightColor: "bg-green-50",
    borderColor: "border-green-400",
    textColor: "text-green-700",
    icon: "🌙",
    popular: true,
    features: [
      "Private cottage accommodation",
      "All organic meals (3 meals)",
      "Full farm activities workshop",
      "Evening bonfire & folk music",
      "Morning nature walk",
      "Unlimited farm access",
    ],
  },
  {
    id: 3,
    title: "Weekend Retreat",
    duration: "2 Nights · 3 Days",
    price: 4999,
    color: "from-teal-500 to-cyan-600",
    lightColor: "bg-teal-50",
    borderColor: "border-teal-400",
    textColor: "text-teal-700",
    icon: "🏕️",
    popular: false,
    features: [
      "Premium cottage with garden view",
      "All meals (8 meals) + snacks",
      "All activities unlimited",
      "Guided nature trek",
      "Cooking masterclass",
      "Cultural performance evening",
      "Souvenir farm produce gift",
    ],
  },
  {
    id: 4,
    title: "Immersion Week",
    duration: "6 Nights · 7 Days",
    price: 12999,
    color: "from-violet-500 to-purple-600",
    lightColor: "bg-violet-50",
    borderColor: "border-violet-400",
    textColor: "text-violet-700",
    icon: "🌿",
    popular: false,
    features: [
      "Deluxe farmhouse suite",
      "All meals (21 meals) + daily snacks",
      "Comprehensive farming training",
      "Personal farm plot to cultivate",
      "Daily yoga & wellness sessions",
      "Village culture immersion",
      "Organic certification workshop",
      "Airport / station pickup",
    ],
  },
];

const GST_RATE = 0.05;

const FOOTER_LINKS = {
  Explore: [
    { label: "Destinations",     to: "/places" },
    { label: "Culture",          to: "/culture" },
    { label: "Activities",       to: "/activities" },
    { label: "Blogs",            to: "/blogs" },
    { label: "Birds",            to: "/birds" },
  ],
  "AI Tools": [
    { label: "AI Chatbot",       to: "/chatbot" },
    { label: "Disease Detector", to: "/disease-detector" },
    { label: "Recommender",      to: "/recommendation" },
  ],
  Support: [
    { label: "My Dashboard",     to: "/dashboard" },
    { label: "Admin Panel",      to: "/admin-dashboard" },
    { label: "Login",            to: "/login" },
    { label: "Sign Up",          to: "/signup" },
  ],
};

/* ============================================================
   STEP INDICATOR
============================================================ */
function StepIndicator({ current }) {
  const steps = ["Choose Package", "Select Add-ons", "Review & Pay"];
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                i < current
                  ? "bg-green-600 text-white"
                  : i === current
                  ? "bg-green-600 text-white ring-4 ring-green-200"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {i < current ? "✓" : i + 1}
            </div>
            <span
              className={`text-xs mt-1 font-medium whitespace-nowrap ${
                i === current ? "text-green-700" : "text-gray-400"
              }`}
            >
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-16 h-0.5 mx-1 mb-5 transition-all duration-500 ${
                i < current ? "bg-green-500" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   PACKAGE CARD
============================================================ */
function PackageCard({ pkg, selected, onSelect }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(pkg)}
      className={`relative cursor-pointer rounded-3xl border-2 overflow-hidden transition-all duration-300 ${
        selected
          ? `${pkg.borderColor} shadow-2xl ring-4 ring-offset-2 ring-green-300`
          : "border-gray-200 hover:border-gray-300 shadow-md"
      }`}
    >
      {/* Popular badge */}
      {pkg.popular && (
        <div className="absolute top-0 left-0 right-0 z-10">
          <div className={`bg-gradient-to-r ${pkg.color} text-white text-xs font-bold text-center py-1.5 tracking-widest uppercase`}>
            ⭐ Most Popular
          </div>
        </div>
      )}

      {/* Gradient header */}
      <div className={`bg-gradient-to-br ${pkg.color} p-6 text-white ${pkg.popular ? "pt-8" : ""}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-4xl">{pkg.icon}</span>
          {selected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center"
            >
              <span className={`${pkg.textColor} font-black text-sm`}>✓</span>
            </motion.div>
          )}
        </div>
        <h3 className="text-xl font-black mb-1">{pkg.title}</h3>
        <p className="text-white/80 text-sm">{pkg.duration}</p>
        <div className="mt-4">
          <span className="text-3xl font-black">₹{pkg.price.toLocaleString()}</span>
          <span className="text-white/70 text-sm ml-1">/ person</span>
        </div>
      </div>

      {/* Features */}
      <div className={`p-5 ${selected ? pkg.lightColor : "bg-white"} transition-colors duration-300`}>
        <ul className="space-y-2">
          {pkg.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full ${selected ? `bg-gradient-to-br ${pkg.color}` : "bg-gray-200"} flex items-center justify-center transition-all`}>
                <span className="text-white text-xs">✓</span>
              </span>
              {f}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

/* ============================================================
   ACTIVITY CARD
============================================================ */
function ActivityCard({ activity, checked, onToggle }) {
  return (
    <motion.label
      whileHover={{ scale: 1.02 }}
      className={`flex items-center justify-between gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
        checked
          ? "border-green-400 bg-green-50 shadow-md"
          : "border-gray-200 bg-white hover:border-green-200"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          checked ? "bg-green-600" : "bg-gray-100"
        } transition-colors`}>
          <span className="text-lg">
            {activity.category === "Outdoor" ? "🌿" :
             activity.category === "Workshop" ? "🎨" :
             activity.category === "Cultural" ? "🎭" : "⭐"}
          </span>
        </div>
        <div>
          <p className={`font-bold text-sm ${checked ? "text-green-800" : "text-gray-800"}`}>
            {activity.title}
          </p>
          <p className="text-xs text-gray-500">
            ⏳ {activity.duration} · {activity.difficulty}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className={`text-sm font-black ${checked ? "text-green-700" : "text-gray-600"}`}>
          + ₹{activity.price}
        </span>
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
          checked ? "bg-green-600 border-green-600" : "border-gray-300"
        }`}>
          {checked && <span className="text-white text-xs font-bold">✓</span>}
        </div>
        <input
          type="checkbox"
          className="hidden"
          checked={checked}
          onChange={onToggle}
        />
      </div>
    </motion.label>
  );
}

/* ============================================================
   SUCCESS MODAL
============================================================ */
function SuccessModal({ booking, user, totalPrice, selectedPkg, date, guests, selectedActivityDetails, onClose }) {
  const navigate = useNavigate();

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(22, 163, 74);
    doc.text("AgroVista Booking Confirmed!", 20, 25);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("─────────────────────────────────────", 20, 35);
    doc.text(`Booking ID   : #${booking?.id || "AGRO" + Date.now()}`, 20, 48);
    doc.text(`Name         : ${user?.name || "Guest"}`, 20, 58);
    doc.text(`Email        : ${user?.email || ""}`, 20, 68);
    doc.text(`Package      : ${selectedPkg?.title}`, 20, 78);
    doc.text(`Date         : ${new Date(date).toLocaleDateString("en-IN")}`, 20, 88);
    doc.text(`Guests       : ${guests}`, 20, 98);
    if (selectedActivityDetails.length > 0) {
      doc.text(`Activities   : ${selectedActivityDetails.map(a => a.title).join(", ")}`, 20, 108);
    }
    doc.text("─────────────────────────────────────", 20, 118);
    doc.setFontSize(14);
    doc.setTextColor(22, 163, 74);
    doc.text(`Total Paid   : ₹${totalPrice.toFixed(2)} (incl. GST)`, 20, 132);
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text("Thank you for choosing AgroVista. Have a wonderful farm experience!", 20, 148);
    doc.text("support@agrovista.com | +91 98765 43210", 20, 158);
    doc.save(`AgroVista_Receipt_${booking?.id || "booking"}.pdf`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 text-center text-white">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl"
          >
            <span className="text-4xl">✅</span>
          </motion.div>
          <h2 className="text-2xl font-black mb-1">Booking Confirmed!</h2>
          <p className="text-green-100 text-sm">
            Your agro-tourism experience is booked
          </p>
        </div>

        {/* Details */}
        <div className="p-6 space-y-3">
          {[
            { label: "Package",  value: selectedPkg?.title },
            { label: "Date",     value: new Date(date).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) },
            { label: "Guests",   value: `${guests} person${guests > 1 ? "s" : ""}` },
            ...(selectedActivityDetails.length > 0
              ? [{ label: "Activities", value: selectedActivityDetails.map(a => a.title).join(", ") }]
              : []),
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-start bg-gray-50 rounded-xl px-4 py-3">
              <span className="text-gray-500 text-sm">{item.label}</span>
              <span className="font-semibold text-gray-800 text-sm text-right max-w-[60%]">{item.value}</span>
            </div>
          ))}

          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex justify-between items-center">
            <span className="text-green-700 font-bold">Total Paid</span>
            <span className="text-green-700 font-black text-lg">₹{totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={downloadPDF}
            className="flex-1 border-2 border-green-600 text-green-700 font-bold py-3 rounded-2xl hover:bg-green-50 transition text-sm flex items-center justify-center gap-2"
          >
            📄 Download Receipt
          </button>
          <button
            onClick={() => { onClose(); navigate("/dashboard"); }}
            className="flex-1 bg-green-600 text-white font-bold py-3 rounded-2xl hover:bg-green-700 transition text-sm"
          >
            View Dashboard →
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ============================================================
   FOOTER
============================================================ */
function BookingFooter() {
  return (
    <footer className="bg-gray-950 text-white pt-14 pb-8 mt-auto">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-10 mb-10">
          <div className="md:col-span-2">
            <Link to="/" className="text-2xl font-black text-green-400 mb-3 block hover:text-green-300 transition-colors">
              AgroVista 🌿
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Secure bookings · Instant confirmation · 100% authentic farm experiences across India.
            </p>
            <div className="flex gap-2">
              {["🔒 SSL Secure", "✅ Verified Farms", "💳 Safe Payment"].map((b, i) => (
                <span key={i} className="text-xs bg-gray-800 text-gray-300 px-2.5 py-1.5 rounded-lg">
                  {b}
                </span>
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
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <span>© 2026 AgroVista. All rights reserved.</span>
          <div className="flex gap-5">
            <Link to="/" className="hover:text-green-400 transition-colors">Privacy Policy</Link>
            <Link to="/" className="hover:text-green-400 transition-colors">Terms of Service</Link>
            <Link to="/" className="hover:text-green-400 transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   MAIN COMPONENT
============================================================ */
export default function BookNow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const formRef = useRef(null);

  /* ---- State ---- */
  const [step, setStep] = useState(0);
  const [place, setPlace] = useState(null);
  const [activities, setActivities] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [guests, setGuests] = useState(1);
  const [date, setDate] = useState("");
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  /* ---- Decode user from token ---- */
  const token = localStorage.getItem("token");
  const user = token ? (() => { try { return JSON.parse(atob(token.split(".")[1])); } catch { return null; } })() : null;

  /* ---- Fetch place & activities ---- */
  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/api/places/${id}`)
        .then((res) => setPlace(res.data))
        .catch(console.error);
    }
    axios.get("http://localhost:5000/api/activities")
      .then((res) => setActivities(res.data))
      .catch(console.error);
  }, [id]);

  /* ---- Price calculation ---- */
  const selectedActivityDetails = activities.filter((a) =>
    selectedActivities.includes(a.id)
  );
  const packageSubtotal = selectedPackage
    ? Number(selectedPackage.price) * guests
    : 0;
  const activitiesTotal = selectedActivityDetails.reduce(
    (sum, a) => sum + Number(a.price), 0
  );
  const subtotal   = packageSubtotal + activitiesTotal;
  const gst        = subtotal * GST_RATE;
  const totalPrice = subtotal + gst;

  /* ---- Season-based & recommended activities ---- */
  const currentMonth = new Date().getMonth();
  let currentSeason = "Summer";
  if (currentMonth >= 10 || currentMonth <= 1) currentSeason = "Winter";
  else if (currentMonth >= 6 && currentMonth <= 9) currentSeason = "Monsoon";

  const recommendedActivities = activities.filter((a) => {
    if (guests >= 4)  return a.category === "Outdoor";
    if (guests === 1) return a.category === "Workshop";
    return a.difficulty === "Easy";
  }).slice(0, 3);

  /* ---- Toggle activity ---- */
  const toggleActivity = (actId) => {
    setSelectedActivities((prev) =>
      prev.includes(actId) ? prev.filter((i) => i !== actId) : [...prev, actId]
    );
  };

  /* ---- Handle booking + Razorpay ---- */
  const handleBooking = async () => {
    if (!token) { alert("Please login first"); navigate("/login"); return; }
    if (!selectedPackage) { alert("Please select a package"); return; }
    if (!date) { alert("Please select a travel date"); return; }

    setLoading(true);
    try {
      /* 1 — Create booking */
      const bookingRes = await axios.post("http://localhost:5000/api/bookings", {
        user_id: user?.userId,
        place_id: id,
        guests,
        booking_date: date,
        total_price: totalPrice,
        activities: selectedActivities,
      });
      const booking = bookingRes.data.booking;

      /* 2 — Create Razorpay order */
      const orderRes = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        { amount: totalPrice, bookingId: booking.id }
      );

      /* 3 — Open Razorpay */
      const options = {
        key: "rzp_test_SL37ZAGpzqt1bq",
        amount: orderRes.data.amount,
        currency: "INR",
        name: "AgroVista",
        description: `${selectedPackage.title} · ${place?.name || "Farm Experience"}`,
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=100",
        order_id: orderRes.data.id,
        handler: async (response) => {
          /* 4 — Verify payment */
          const verifyRes = await axios.post(
            "http://localhost:5000/api/payment/verify",
            response
          );
          if (verifyRes.data.success) {
            setConfirmedBooking(booking);
            setBookingSuccess(true);
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name:  user?.name  || "",
          email: user?.email || "",
        },
        theme: { color: "#16a34a" },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Booking error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ---- Min date (tomorrow) ---- */
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  /* ============================================================
     RENDER
  ============================================================ */
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen bg-[#f8faf7]"
    >
      <Navbar />

      {/* ===== HERO STRIP ===== */}
      <div className="mt-16 relative overflow-hidden bg-gradient-to-r from-green-800 via-emerald-700 to-teal-700 text-white">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

        <div className="relative max-w-5xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center gap-6">
          {/* Place info */}
          <div className="flex-1">
            <p className="text-green-200 text-xs font-bold uppercase tracking-widest mb-2">
              🌾 Book Your Experience
            </p>
            <h1 className="text-3xl md:text-4xl font-black mb-2" style={{ fontFamily: "Georgia, serif" }}>
              {place ? place.name : "Farm Experience"}
            </h1>
            {place && (
              <p className="text-green-100 flex items-center gap-2 text-sm">
                <span>📍 {place.district ? `${place.district}, ` : ""}{place.state}</span>
                {place.rating && <span>· ⭐ {place.rating}</span>}
                {place.best_time && <span>· 🗓️ Best: {place.best_time}</span>}
              </p>
            )}
          </div>

          {/* Place thumbnail */}
          {place?.image_url && (
            <div className="w-32 h-24 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 ring-4 ring-white/20">
              <img
                src={place.image_url}
                alt={place.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            </div>
          )}
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-grow max-w-6xl mx-auto w-full px-4 md:px-6 py-10">

        <StepIndicator current={step} />

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ===== LEFT COLUMN (steps) ===== */}
          <div className="lg:col-span-2 space-y-8">

            {/* ── STEP 0: Package Selection ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                <h2 className="text-xl font-black text-gray-900">Choose Your Package</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {PACKAGES.map((pkg) => (
                  <PackageCard
                    key={pkg.id}
                    pkg={pkg}
                    selected={selectedPackage?.id === pkg.id}
                    onSelect={(p) => {
                      setSelectedPackage(p);
                      if (step === 0) {
                        setTimeout(() => {
                          setStep(1);
                          formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }, 300);
                      }
                    }}
                  />
                ))}
              </div>
            </motion.div>

            {/* ── STEP 1: Guests & Date ── */}
            <AnimatePresence>
              {(step >= 1 || selectedPackage) && (
                <motion.div
                  ref={formRef}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl shadow-md border border-gray-100 p-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                    <h2 className="text-xl font-black text-gray-900">Guests & Travel Date</h2>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    {/* Guests */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        👥 Number of Guests
                      </label>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setGuests((g) => Math.max(1, g - 1))}
                          className="w-11 h-11 rounded-full bg-gray-100 hover:bg-green-100 text-gray-700 font-black text-xl transition-colors flex items-center justify-center"
                        >
                          −
                        </button>
                        <div className="flex-1 text-center">
                          <span className="text-4xl font-black text-green-700">{guests}</span>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {guests === 1 ? "person" : "people"}
                          </p>
                        </div>
                        <button
                          onClick={() => setGuests((g) => Math.min(20, g + 1))}
                          className="w-11 h-11 rounded-full bg-gray-100 hover:bg-green-100 text-gray-700 font-black text-xl transition-colors flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                      {guests >= 10 && (
                        <p className="text-xs text-green-600 mt-2 bg-green-50 px-3 py-1.5 rounded-lg">
                          🎉 Group discount available! Contact us.
                        </p>
                      )}
                    </div>

                    {/* Date */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        📅 Select Travel Date
                      </label>
                      <input
                        type="date"
                        value={date}
                        min={minDate}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-gray-700 focus:outline-none focus:border-green-400 transition-colors text-sm"
                      />
                      {date && (
                        <p className="text-xs text-green-600 mt-2">
                          ✅ {new Date(date).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── STEP 2: Activities Add-ons ── */}
            <AnimatePresence>
              {(step >= 1 || selectedPackage) && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-3xl shadow-md border border-gray-100 p-8"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                    <h2 className="text-xl font-black text-gray-900">Activity Add-ons</h2>
                    <span className="ml-auto text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                      Optional
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mb-6 ml-11">
                    Enhance your stay with curated farm experiences
                  </p>

                  {/* Recommended for you */}
                  {recommendedActivities.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-3 flex items-center gap-1">
                        ⭐ Recommended for your group
                      </p>
                      <div className="space-y-2">
                        {recommendedActivities.map((a) => (
                          <ActivityCard
                            key={a.id}
                            activity={a}
                            checked={selectedActivities.includes(a.id)}
                            onToggle={() => toggleActivity(a.id)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* All activities */}
                  {activities.filter((a) => !recommendedActivities.find((r) => r.id === a.id)).length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                        All Available Activities
                      </p>
                      <div className="space-y-2 max-h-80 overflow-y-auto pr-1 custom-scroll">
                        {activities
                          .filter((a) => !recommendedActivities.find((r) => r.id === a.id))
                          .map((a) => (
                            <ActivityCard
                              key={a.id}
                              activity={a}
                              checked={selectedActivities.includes(a.id)}
                              onToggle={() => toggleActivity(a.id)}
                            />
                          ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* ===== RIGHT COLUMN (price summary + CTA) ===== */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">

              {/* Price breakdown card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
              >
                {/* Card header */}
                <div className="bg-gradient-to-r from-green-700 to-emerald-600 p-5 text-white">
                  <p className="text-green-100 text-xs uppercase tracking-widest mb-1">Price Summary</p>
                  <p className="text-3xl font-black">
                    ₹{totalPrice > 0 ? totalPrice.toFixed(2) : "—"}
                  </p>
                  <p className="text-green-200 text-xs mt-0.5">Total including 5% GST</p>
                </div>

                <div className="p-5 space-y-3">
                  {/* Package line */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      {selectedPackage ? selectedPackage.title : "No package selected"}
                    </span>
                    <span className="font-bold text-gray-800">
                      {selectedPackage
                        ? `₹${selectedPackage.price.toLocaleString()} × ${guests}`
                        : "—"}
                    </span>
                  </div>

                  {/* Package subtotal */}
                  {packageSubtotal > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Package subtotal</span>
                      <span className="font-semibold text-gray-700">
                        ₹{packageSubtotal.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {/* Activities */}
                  {selectedActivityDetails.map((a) => (
                    <div key={a.id} className="flex justify-between text-sm">
                      <span className="text-gray-500 truncate max-w-[60%]">+ {a.title}</span>
                      <span className="font-semibold text-gray-700">₹{Number(a.price).toLocaleString()}</span>
                    </div>
                  ))}

                  <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-semibold text-gray-700">₹{subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">GST (5%)</span>
                    <span className="font-semibold text-gray-700">₹{gst.toFixed(2)}</span>
                  </div>

                  <div className="border-t-2 border-green-200 pt-3 flex justify-between">
                    <span className="font-black text-gray-900">Total</span>
                    <span className="font-black text-green-700 text-lg">
                      ₹{totalPrice > 0 ? totalPrice.toFixed(2) : "0.00"}
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <div className="px-5 pb-5">
                  <button
                    onClick={() => {
                      if (!selectedPackage) { alert("Please select a package first"); return; }
                      if (!date) { alert("Please select a travel date"); return; }
                      handleBooking();
                    }}
                    disabled={loading || !selectedPackage}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-black py-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-base"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                          <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      `Pay ₹${totalPrice > 0 ? Math.round(totalPrice) : "—"} →`
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-400">
                    <span>🔒</span>
                    <span>Secured by Razorpay · SSL encrypted</span>
                  </div>
                </div>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3"
              >
                {[
                  { icon: "✅", text: "Instant booking confirmation" },
                  { icon: "🔄", text: "Free cancellation up to 48hrs" },
                  { icon: "🌿",  text: "100% verified farm experience" },
                  { icon: "💬", text: "24/7 customer support" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="text-base">{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </motion.div>

              {/* Need help */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center"
              >
                <p className="text-sm font-bold text-amber-800 mb-1">Need help choosing?</p>
                <p className="text-xs text-amber-700 mb-3">Our AI can suggest the perfect package for you</p>
                <Link
                  to="/chatbot"
                  className="inline-block bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
                >
                  🤖 Ask AI Chatbot
                </Link>
              </motion.div>

            </div>
          </div>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <BookingFooter />

      {/* ===== SUCCESS MODAL ===== */}
      <AnimatePresence>
        {bookingSuccess && (
          <SuccessModal
            booking={confirmedBooking}
            user={user}
            totalPrice={totalPrice}
            selectedPkg={selectedPackage}
            date={date}
            guests={guests}
            selectedActivityDetails={selectedActivityDetails}
            onClose={() => setBookingSuccess(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}