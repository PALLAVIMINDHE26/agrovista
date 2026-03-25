import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
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
    { label: "Blogs",            to: "/blogs"            },
    { label: "Birds",            to: "/birds"            },
  ],
  "AI Tools": [
    { label: "AI Chatbot",       to: "/chatbot"          },
    { label: "Disease Detector", to: "/disease-detector" },
    { label: "Recommender",      to: "/recommendation"   },
  ],
  Account: [
    { label: "Edit Profile",     to: "/edit-profile"     },
    { label: "Admin Panel",      to: "/admin-dashboard"  },
    { label: "Login",            to: "/login"            },
    { label: "Sign Up",          to: "/signup"           },
  ],
};

/* ============================================================
   STATUS CONFIG
============================================================ */
const STATUS_CONFIG = {
  confirmed: {
    label: "Confirmed",
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200",
    dot: "bg-green-500",
    icon: "✓",
  },
  approved: {
    label: "Confirmed",
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200",
    dot: "bg-green-500",
    icon: "✓",
  },
  pending: {
    label: "Pending",
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
    icon: "⏳",
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
    icon: "✕",
  },
};

/* ============================================================
   HELPERS
============================================================ */
const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const getStatusBadge = (booking) => {
  if (booking.status === "cancelled") return STATUS_CONFIG.cancelled;
  if (booking.status === "confirmed" || booking.status === "approved") {
    const today = new Date();
    const bookingDate = new Date(booking.booking_date);
    if (bookingDate < today) {
      return {
        label: "Completed",
        bg: "bg-gray-100",
        text: "text-gray-600",
        border: "border-gray-200",
        dot: "bg-gray-500",
        icon: "🏁",
      };
    }
    return STATUS_CONFIG.confirmed;
  }
  return STATUS_CONFIG.pending;
};

/* ============================================================
   FOOTER
============================================================ */
function DashboardFooter() {
  return (
    <footer className="bg-gray-950 text-white pt-14 pb-8 mt-auto">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-10 mb-10">
          <div className="md:col-span-2">
            <Link
              to="/"
              className="text-2xl font-black text-green-400 mb-3 block hover:text-green-300 transition-colors"
            >
              AgroVista 🌿
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Your personal agrotourism dashboard — manage bookings,
              download invoices and explore new farm experiences across
              rural India.
            </p>
            <div className="flex flex-wrap gap-2">
              {["🔒 Secure", "📄 Instant Invoices", "🌿 Verified Farms"].map(
                (b, i) => (
                  <span
                    key={i}
                    className="text-xs bg-gray-800 text-gray-300 px-3 py-1.5 rounded-lg border border-gray-700"
                  >
                    {b}
                  </span>
                )
              )}
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
            <Link to="/" className="hover:text-green-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/" className="hover:text-green-400 transition-colors">
              Terms of Service
            </Link>
            <Link to="/places" className="hover:text-green-400 transition-colors">
              All Destinations
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   BOOKING CARD
============================================================ */
function BookingCard({ booking, onCancel, onDownload }) {
  const [expanded, setExpanded] = useState(false);
  const badge = getStatusBadge(booking);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Status top bar */}
      <div className={`h-1.5 ${badge.dot}`} />

      <div className="p-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${badge.bg} ${badge.text} ${badge.border}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                {badge.label}
              </span>
              <span className="text-xs text-gray-400">
                #{String(booking.id).padStart(4, "0")}
              </span>
            </div>
            <h3 className="text-lg font-black text-gray-900 truncate">
              {booking.place_name || "Agrotourism Experience"}
            </h3>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-400 hover:text-green-600 transition-colors flex-shrink-0"
          >
            <motion.span
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="block text-lg"
            >
              ▾
            </motion.span>
          </button>
        </div>

        {/* Quick info grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[
            { icon: "📅", label: "Date",    value: formatDate(booking.booking_date) },
            { icon: "👥", label: "Guests",  value: `${booking.guests} person${booking.guests > 1 ? "s" : ""}` },
            { icon: "💰", label: "Amount",  value: `₹${Number(booking.total_price).toLocaleString()}` },
            { icon: "💳", label: "Payment", value: booking.payment_status === "paid" ? "Paid ✓" : "Pending" },
          ].map((item, i) => (
            <div key={i} className="bg-gray-50 rounded-2xl p-3">
              <p className="text-base mb-0.5">{item.icon}</p>
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                {item.label}
              </p>
              <p className="font-bold text-gray-800 text-sm mt-0.5 truncate">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Activities pill */}
        {booking.activities && booking.activities !== "None" && (
          <div className="mb-5">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
              🎯 Activities
            </p>
            <div className="flex flex-wrap gap-1.5">
              {booking.activities.split(", ").map((act, i) => (
                <span
                  key={i}
                  className="bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full border border-green-100 font-medium"
                >
                  {act}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Expanded details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="border-t border-gray-100 pt-4 mb-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { label: "Booking ID",    value: `#${String(booking.id).padStart(4, "0")}` },
                    { label: "Payment ID",    value: booking.payment_id || "N/A" },
                    { label: "Order ID",      value: booking.order_id   || "N/A" },
                    { label: "Booking Date",  value: formatDate(booking.booking_date) },
                  ].map((item, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400">{item.label}</p>
                      <p className="font-semibold text-gray-700 text-sm mt-0.5 truncate">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
          <button
            onClick={() => onDownload(booking)}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm"
          >
            <span>📄</span> Download Invoice
          </button>

          <Link
            to={`/places/${booking.place_id}`}
            className="flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm border border-green-200"
          >
            <span>🗺️</span> View Place
          </Link>

          {booking.status !== "cancelled" && (
            <button
              onClick={() => onCancel(booking.id)}
              className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm border border-red-200 ml-auto"
            >
              <span>✕</span> Cancel
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ============================================================
   MAIN DASHBOARD
============================================================ */
export default function UserDashboard() {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage]   = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  /* ---- Decode token ---- */
  const token = localStorage.getItem("token");
  const user  = token
    ? (() => { try { return JSON.parse(atob(token.split(".")[1])); } catch { return null; } })()
    : null;

  /* ---- Fetch bookings (existing logic preserved) ---- */
  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/bookings/user/${user.userId}`
        );
        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    fetchBookings();
    const interval = setInterval(fetchBookings, 15000);
    return () => clearInterval(interval);
  }, [user]);

  /* ---- Cancel booking (existing logic preserved) ---- */
  const cancelBooking = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/bookings/${id}`,
        { status: "cancelled" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookings((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, status: "cancelled" } : b
        )
      );
      setMessage("Booking cancelled successfully ✕");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Cancel error:", err);
    }
  };

  /* ---- Download invoice (existing logic preserved) ---- */
  const downloadInvoice = (booking) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(22, 163, 74);
    doc.text("AgroVista Booking Invoice", 20, 25);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("─────────────────────────────────────────", 20, 35);
    doc.text(`Booking ID   : #${String(booking.id).padStart(4, "0")}`, 20, 48);
    doc.text(`Name         : ${user?.name  || "Guest"}`, 20, 58);
    doc.text(`Email        : ${user?.email || ""}`,     20, 68);
    doc.text(`Destination  : ${booking.place_name || ""}`, 20, 78);
    doc.text(`Booking Date : ${formatDate(booking.booking_date)}`, 20, 88);
    doc.text(`Guests       : ${booking.guests}`,        20, 98);
    doc.text(`Status       : ${booking.status}`,        20, 108);
    doc.text(`Payment      : ${booking.payment_status || "pending"}`, 20, 118);
    doc.text("─────────────────────────────────────────", 20, 128);
    doc.setFontSize(14);
    doc.setTextColor(22, 163, 74);
    doc.text(`Total Paid   : ₹${Number(booking.total_price).toLocaleString()}`, 20, 142);
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text("Thank you for choosing AgroVista!", 20, 160);
    doc.text("support@agrovista.com | +91 98765 43210", 20, 170);
    doc.save(`AgroVista_Invoice_${booking.id}.pdf`);
  };

  /* ---- Filtered bookings ---- */
  const filteredBookings = bookings.filter((b) => {
    if (activeTab === "all")       return true;
    if (activeTab === "upcoming")  return b.status === "confirmed" && new Date(b.booking_date) >= new Date();
    if (activeTab === "pending")   return b.status === "pending";
    if (activeTab === "completed") return b.status === "confirmed" && new Date(b.booking_date) < new Date();
    if (activeTab === "cancelled") return b.status === "cancelled";
    return true;
  });

  /* ---- Stats ---- */
  const stats = {
    total:     bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    pending:   bookings.filter((b) => b.status === "pending").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
    spent:     bookings
      .filter((b) => b.payment_status === "paid")
      .reduce((s, b) => s + Number(b.total_price), 0),
  };

  /* ---- Greeting ---- */
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  /* ============================================================
     RENDER
  ============================================================ */
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col min-h-screen bg-gray-50"
    >
      <Navbar />

      {/* ===== HERO HEADER ===== */}
      <div className="mt-16 bg-gradient-to-r from-green-800 via-emerald-700 to-teal-700 text-white relative overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

        <div className="relative max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

            {/* Left — user info */}
            <div className="flex items-center gap-5">
              {/* Avatar */}
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl border border-white/20 flex-shrink-0 shadow-xl">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div>
                <p className="text-green-200 text-sm font-medium">
                  {greeting} 👋
                </p>
                <h1
                  className="text-2xl md:text-3xl font-black mt-0.5"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {user?.name || "Traveller"}
                </h1>
                <p className="text-green-100 text-sm mt-1 flex items-center gap-2">
                  <span>📧 {user?.email}</span>
                  <span className="w-1 h-1 bg-green-300 rounded-full" />
                  <span className="capitalize bg-white/10 px-2 py-0.5 rounded-full text-xs font-bold">
                    {user?.role || "user"}
                  </span>
                </p>
              </div>
            </div>

            {/* Right — action buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/edit-profile")}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-bold px-5 py-2.5 rounded-xl transition-all text-sm flex items-center gap-2"
              >
                ✏️ Edit Profile
              </button>
              <button
                onClick={() => navigate("/places")}
                className="bg-white text-green-700 hover:bg-green-50 font-bold px-5 py-2.5 rounded-xl transition-all text-sm flex items-center gap-2 shadow-lg hover:scale-105"
              >
                🌾 Book New Trip
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-grow max-w-6xl mx-auto w-full px-4 md:px-6 py-10">

        {/* ===== STATS CARDS ===== */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          {[
            { label: "Total Bookings", value: stats.total,     icon: "📅", color: "from-blue-500 to-indigo-600",   light: "bg-blue-50  text-blue-700"   },
            { label: "Confirmed",      value: stats.confirmed, icon: "✅", color: "from-green-500 to-emerald-600", light: "bg-green-50 text-green-700"  },
            { label: "Pending",        value: stats.pending,   icon: "⏳", color: "from-amber-500 to-orange-500",  light: "bg-amber-50 text-amber-700"  },
            { label: "Cancelled",      value: stats.cancelled, icon: "✕",  color: "from-red-500 to-rose-600",      light: "bg-red-50   text-red-700"    },
            { label: "Total Spent",    value: `₹${stats.spent.toLocaleString()}`, icon: "💰", color: "from-violet-500 to-purple-600", light: "bg-violet-50 text-violet-700" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white text-lg mb-3 shadow-md`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
              <p className="text-gray-500 text-xs mt-0.5 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* ===== SUCCESS MESSAGE ===== */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-green-50 border border-green-200 text-green-700 font-semibold px-5 py-3 rounded-2xl mb-6 flex items-center gap-2"
            >
              <span>✅</span> {message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== BOOKINGS SECTION ===== */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Section header */}
          <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-gray-900">My Bookings</h2>
              <p className="text-gray-500 text-sm mt-0.5">
                {filteredBookings.length} booking{filteredBookings.length !== 1 ? "s" : ""} found
              </p>
            </div>

            {/* Tab filter */}
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
              {[
                { key: "all",       label: "All"       },
                { key: "upcoming",  label: "Upcoming"  },
                { key: "pending",   label: "Pending"   },
                { key: "completed", label: "Completed" },
                { key: "cancelled", label: "Cancelled" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                    activeTab === tab.key
                      ? "bg-white shadow-sm text-green-700"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bookings list */}
          <div className="p-6">
            {bookings.length === 0 ? (
              /* Empty state — no bookings at all */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="text-8xl mb-5">🌾</div>
                <h3 className="text-xl font-black text-gray-700 mb-2">
                  No bookings yet
                </h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                  Start your agrotourism journey — explore 60+ farm stays
                  across India and book your first experience.
                </p>
                <button
                  onClick={() => navigate("/places")}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-2xl transition-all hover:scale-105 shadow-lg"
                >
                  Explore Destinations →
                </button>
              </motion.div>
            ) : filteredBookings.length === 0 ? (
              /* Empty state — filtered */
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-gray-500 font-medium">
                  No {activeTab} bookings found
                </p>
                <button
                  onClick={() => setActiveTab("all")}
                  className="mt-4 text-green-600 hover:underline text-sm font-semibold"
                >
                  Show all bookings
                </button>
              </div>
            ) : (
              /* Booking cards */
              <div className="space-y-4">
                <AnimatePresence>
                  {filteredBookings.map((booking, i) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: i * 0.06 }}
                    >
                      <BookingCard
                        booking={booking}
                        onCancel={cancelBooking}
                        onDownload={downloadInvoice}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* ===== QUICK ACTIONS ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            { icon: "🗺️", title: "Explore Destinations", desc: "60+ farm stays across India", to: "/places",           color: "hover:border-green-300  hover:bg-green-50"  },
            { icon: "🎯", title: "Browse Activities",     desc: "24 curated experiences",     to: "/activities",        color: "hover:border-blue-300   hover:bg-blue-50"   },
            { icon: "🤖", title: "AI Chatbot",            desc: "Ask farming questions",       to: "/chatbot",           color: "hover:border-purple-300 hover:bg-purple-50" },
            { icon: "🧠", title: "Plan My Trip",          desc: "AI-powered recommendations",  to: "/recommendation",    color: "hover:border-amber-300  hover:bg-amber-50"  },
          ].map((item, i) => (
            <Link
              key={i}
              to={item.to}
              className={`bg-white rounded-2xl border-2 border-gray-100 p-5 transition-all duration-200 hover:shadow-md group ${item.color}`}
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <p className="font-black text-gray-800 text-sm group-hover:text-gray-900">
                {item.title}
              </p>
              <p className="text-gray-400 text-xs mt-1">{item.desc}</p>
            </Link>
          ))}
        </motion.div>

      </div>

      <DashboardFooter />
    </motion.div>
  );
}