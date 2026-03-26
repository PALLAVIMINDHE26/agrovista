import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import {
  Users, CalendarCheck, MapPin, IndianRupee,
  TrendingUp, Star, CheckCircle, Clock,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  BarElement, LineElement, PointElement,
  Title, Tooltip, Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import Navbar from "../components/Navbar";

ChartJS.register(
  CategoryScale, LinearScale,
  BarElement, LineElement, PointElement,
  Title, Tooltip, Legend
);

/* ============================================================
   FOOTER LINKS
============================================================ */
const FOOTER_LINKS = {
  Explore: [
    { label: "Destinations",     to: "/places"           },
    { label: "Culture",          to: "/culture"          },
    { label: "Activities",       to: "/activities"       },
    { label: "Book Now",         to: "/book-now"         },
  ],
  "AI Tools": [
    { label: "AI Chatbot",       to: "/chatbot"          },
    { label: "Disease Detector", to: "/disease-detector" },
    { label: "Recommender",      to: "/recommendation"   },
  ],
  Manage: [
    { label: "User Dashboard",   to: "/dashboard"        },
    { label: "Edit Profile",     to: "/edit-profile"     },
    { label: "Login",            to: "/login"            },
  ],
};

/* ============================================================
   FOOTER
============================================================ */
function AdminFooter() {
  return (
    <footer className="bg-gray-950 text-white pt-14 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-10 mb-10">
          <div className="md:col-span-2">
            <Link
              to="/"
              className="text-2xl font-black text-green-400 mb-3 block hover:text-green-300 transition-colors"
            >
              AgroVista 🌿
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Admin control panel for managing AgroVista — bookings,
              destinations, activities, reviews and platform analytics
              all in one place.
            </p>
            <div className="flex flex-wrap gap-2">
              {["🔒 Admin Only", "📊 Live Analytics", "⚡ Real-time"].map(
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
          <span>© 2026 AgroVista Admin Panel. All rights reserved.</span>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-green-400 transition-colors">Privacy Policy</Link>
            <Link to="/" className="hover:text-green-400 transition-colors">Terms of Service</Link>
            <Link to="/places" className="hover:text-green-400 transition-colors">Platform</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   STAT CARD
============================================================ */
function StatCard({ icon: Icon, label, value, sub, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-md ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <p className="text-gray-500 text-sm font-medium mb-1">{label}</p>
      <p className="text-3xl font-black text-gray-900">
        <CountUp end={Number(value) || 0} duration={2} separator="," />
      </p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </motion.div>
  );
}

/* ============================================================
   CHART OPTIONS
============================================================ */
const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: "top" },
    title:  { display: false },
  },
  scales: {
    y: {
      grid: { color: "rgba(0,0,0,0.05)" },
      ticks: { color: "#9ca3af" },
    },
    x: {
      grid: { display: false },
      ticks: { color: "#9ca3af" },
    },
  },
};

/* ============================================================
   ADMIN DASHBOARD — all existing logic preserved
============================================================ */
export default function AdminDashboard() {
  const navigate = useNavigate();

  /* ---- Existing state ---- */
  const [stats,              setStats]              = useState({});
  const [bookings,           setBookings]           = useState([]);
  const [activeTab,          setActiveTab]          = useState("overview");
  const [message,            setMessage]            = useState("");
  const [placesCount,        setPlacesCount]        = useState(0);
  const [activityAnalytics,  setActivityAnalytics]  = useState([]);
  const [pendingReviews,     setPendingReviews]     = useState([]);

  /* ---- Existing fetch logic ---- */
  const fetchStats = () => {
    axios.get("http://localhost:5000/api/admin/stats")
      .then((res) => setStats(res.data))
      .catch(console.error);
  };

  const fetchBookings = () => {
    axios.get("http://localhost:5000/api/bookings")
      .then((res) => setBookings(res.data))
      .catch(console.error);
  };

  const updateStatus = (id, status) => {
    axios.put(`http://localhost:5000/api/bookings/${id}`, { status })
      .then(() => {
        setMessage(`Booking ${status} successfully ✅`);
        setTimeout(() => setMessage(""), 3000);
        fetchBookings();
        fetchStats();
      })
      .catch(console.error);
  };

  const fetchActivityAnalytics = () => {
    axios.get("http://localhost:5000/api/admin/activity-analytics")
      .then((res) => setActivityAnalytics(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchStats();
    fetchBookings();
    fetchActivityAnalytics();
    axios.get("http://localhost:5000/api/places")
      .then((res) => setPlacesCount(res.data.length))
      .catch(console.error);
    axios.get("http://localhost:5000/api/admin/pending-reviews")
      .then((res) => setPendingReviews(res.data))
      .catch(console.error);
  }, []);

  /* ---- Existing analytics logic ---- */
  const totalActivityBookings = activityAnalytics.reduce(
    (sum, a) => sum + Number(a.bookings_count), 0
  );

  const monthlyData = {};
  bookings.forEach((b) => {
    const month = new Date(b.booking_date).toLocaleString("default", { month: "short" });
    if (!monthlyData[month]) monthlyData[month] = { revenue: 0, count: 0 };
    monthlyData[month].revenue += Number(b.total_price);
    monthlyData[month].count   += 1;
  });
  const labels = Object.keys(monthlyData);

  const revenueData = {
    labels,
    datasets: [{
      label: "Monthly Revenue (₹)",
      data: labels.map((m) => monthlyData[m].revenue),
      borderColor: "#16a34a",
      backgroundColor: "rgba(22,163,74,0.1)",
      tension: 0.4,
      fill: true,
    }],
  };

  const bookingData = {
    labels,
    datasets: [{
      label: "Bookings",
      data: labels.map((m) => monthlyData[m].count),
      backgroundColor: "rgba(37,99,235,0.8)",
      borderRadius: 8,
    }],
  };

  const months = Object.keys(monthlyData);
  const currentRevenue  = months.length ? monthlyData[months[months.length - 1]].revenue : 0;
  const previousRevenue = months.length > 1 ? monthlyData[months[months.length - 2]].revenue : 0;
  const revenueGrowth   = previousRevenue > 0
    ? (((currentRevenue - previousRevenue) / previousRevenue) * 100).toFixed(1)
    : 0;

  /* ---- Tabs config ---- */
  const TABS = [
    { key: "overview",        label: "Overview",        icon: "📊" },
    { key: "bookings",        label: "Bookings",        icon: "📅" },
    { key: "analytics",       label: "Analytics",       icon: "📈" },
    { key: "pending-reviews", label: "Reviews",         icon: "⭐", badge: pendingReviews.length },
  ];

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });

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
      <div className="mt-16 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/30 to-emerald-900/20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/5 rounded-full -translate-y-1/2 translate-x-1/3" />

        <div className="relative max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-green-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl border border-green-500/30 flex-shrink-0">
              ⚙️
            </div>
            <div>
              <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-1">
                Admin Control Panel
              </p>
              <h1
                className="text-2xl md:text-3xl font-black"
                style={{ fontFamily: "Georgia, serif" }}
              >
                AgroVista Dashboard
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Manage bookings, destinations, reviews and platform analytics
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/places")}
              className="bg-green-600 hover:bg-green-500 text-white font-bold px-5 py-2.5 rounded-xl transition-all text-sm hover:scale-105"
            >
              🌾 View Platform
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
              className="bg-gray-700 hover:bg-gray-600 text-gray-200 font-bold px-5 py-2.5 rounded-xl transition-all text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-6 py-8">

        {/* ===== STAT CARDS ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
          <StatCard
            icon={Users}
            label="Total Users"
            value={stats.totalUsers || 0}
            sub="Registered accounts"
            color="bg-gradient-to-br from-blue-500 to-indigo-600"
            delay={0}
          />
          <StatCard
            icon={CalendarCheck}
            label="Active Bookings"
            value={stats.activeBookings || 0}
            sub="Pending + confirmed"
            color="bg-gradient-to-br from-green-500 to-emerald-600"
            delay={0.08}
          />
          <StatCard
            icon={MapPin}
            label="Destinations"
            value={placesCount}
            sub="Farm stays listed"
            color="bg-gradient-to-br from-orange-500 to-amber-600"
            delay={0.16}
          />
          <StatCard
            icon={IndianRupee}
            label="Total Revenue"
            value={stats.totalRevenue || 0}
            sub="From confirmed bookings"
            color="bg-gradient-to-br from-violet-500 to-purple-600"
            delay={0.24}
          />
        </div>

        {/* ===== SECONDARY STATS ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Activity Bookings", value: totalActivityBookings, icon: "🎯", color: "bg-teal-50 text-teal-700 border-teal-200" },
            { label: "Pending Reviews",   value: pendingReviews.length, icon: "⭐", color: "bg-amber-50 text-amber-700 border-amber-200" },
            { label: "Revenue Growth",    value: `${revenueGrowth}%`,   icon: "📈", color: "bg-green-50 text-green-700 border-green-200" },
            { label: "Total Bookings",    value: bookings.length,       icon: "📋", color: "bg-blue-50 text-blue-700 border-blue-200" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.07 }}
              className={`rounded-2xl border p-4 ${s.color}`}
            >
              <p className="text-2xl mb-1">{s.icon}</p>
              <p className="text-2xl font-black">{s.value}</p>
              <p className="text-xs font-medium opacity-80 mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* ===== SUCCESS MESSAGE ===== */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-green-50 border border-green-200 text-green-700 font-semibold px-5 py-3 rounded-2xl mb-6 flex items-center gap-2"
            >
              ✅ {message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== TAB NAV ===== */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap transition-all border-b-2 ${
                  activeTab === tab.key
                    ? "border-green-600 text-green-700 bg-green-50/50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
                {tab.badge > 0 && (
                  <span className="bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded-full min-w-[20px] text-center">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="p-6">

            {/* ====== OVERVIEW TAB ====== */}
            {activeTab === "overview" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid md:grid-cols-2 gap-6"
              >
                {/* Platform summary */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp size={18} className="text-green-600" />
                    Platform Summary
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: "Total Users",      value: stats.totalUsers    || 0 },
                      { label: "Total Bookings",   value: bookings.length          },
                      { label: "Total Places",     value: placesCount              },
                      { label: "Total Revenue",    value: `₹${Number(stats.totalRevenue || 0).toLocaleString()}` },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                        <span className="text-gray-500 text-sm">{item.label}</span>
                        <span className="font-black text-gray-900">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Latest booking */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                    <Clock size={18} className="text-blue-600" />
                    Latest Bookings
                  </h3>
                  {bookings.slice(0, 5).map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between py-2.5 border-b border-gray-200 last:border-0"
                    >
                      <div>
                        <p className="text-sm font-bold text-gray-800">
                          #{String(b.id).padStart(4, "0")}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(b.booking_date)} · {b.guests} guests
                        </p>
                      </div>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          b.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : b.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ====== BOOKINGS TAB ====== */}
            {activeTab === "bookings" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-black text-gray-900 text-lg">
                    All Bookings ({bookings.length})
                  </h3>
                  <button
                    onClick={fetchBookings}
                    className="text-sm text-green-600 hover:underline font-semibold"
                  >
                    ↻ Refresh
                  </button>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-gray-200">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        {["ID", "Date", "Guests", "Amount", "Status", "Activities", "Actions"].map(
                          (h) => (
                            <th
                              key={h}
                              className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider"
                            >
                              {h}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {bookings.map((b) => (
                        <tr
                          key={b.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3 font-bold text-gray-700">
                            #{String(b.id).padStart(4, "0")}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {formatDate(b.booking_date)}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {b.guests}
                          </td>
                          <td className="px-4 py-3 font-bold text-green-700">
                            ₹{Number(b.total_price).toLocaleString()}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`text-xs font-bold px-3 py-1 rounded-full ${
                                b.status === "confirmed"
                                  ? "bg-green-100 text-green-700"
                                  : b.status === "cancelled"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {b.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500 max-w-[150px] truncate">
                            {b.activities || "—"}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => updateStatus(b.id, "confirmed")}
                                className="bg-green-100 hover:bg-green-200 text-green-700 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                              >
                                <CheckCircle size={12} /> Confirm
                              </button>
                              <button
                                onClick={() => updateStatus(b.id, "cancelled")}
                                className="bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {bookings.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                      No bookings found
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ====== ANALYTICS TAB ====== */}
            {activeTab === "analytics" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                {/* Revenue growth badge */}
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-5 py-3 w-fit">
                  <TrendingUp size={18} className="text-green-600" />
                  <span className="text-sm text-gray-600">Revenue Growth vs last month:</span>
                  <span className="font-black text-green-700 text-lg">
                    {revenueGrowth}%
                  </span>
                </div>

                {/* Revenue chart */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="font-black text-gray-900 mb-5">
                    📈 Monthly Revenue
                  </h3>
                  <Line data={revenueData} options={chartOptions} />
                </div>

                {/* Bookings chart */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="font-black text-gray-900 mb-5">
                    📅 Monthly Bookings
                  </h3>
                  <Bar data={bookingData} options={chartOptions} />
                </div>

                {/* Activity popularity */}
                {activityAnalytics.length > 0 && (
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="font-black text-gray-900 mb-5">
                      🎯 Activity Popularity
                    </h3>
                    <Bar
                      data={{
                        labels: activityAnalytics.map((a) => a.title),
                        datasets: [
                          {
                            label: "Bookings",
                            data: activityAnalytics.map((a) => a.bookings_count),
                            backgroundColor: "rgba(22,163,74,0.8)",
                            borderRadius: 6,
                          },
                          {
                            label: "Revenue (₹)",
                            data: activityAnalytics.map((a) => a.revenue),
                            backgroundColor: "rgba(245,158,11,0.8)",
                            borderRadius: 6,
                          },
                        ],
                      }}
                      options={chartOptions}
                    />
                  </div>
                )}
              </motion.div>
            )}

            {/* ====== PENDING REVIEWS TAB ====== */}
            {activeTab === "pending-reviews" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-black text-gray-900 text-lg">
                    Pending Reviews ({pendingReviews.length})
                  </h3>
                </div>

                {pendingReviews.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">⭐</div>
                    <p className="text-gray-500 font-medium">
                      No pending reviews — all caught up!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingReviews.map((review) => (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-50 rounded-2xl border border-gray-200 p-5 flex items-start justify-between gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            {/* Stars */}
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((n) => (
                                <span
                                  key={n}
                                  className={`text-sm ${
                                    n <= review.rating
                                      ? "text-amber-400"
                                      : "text-gray-200"
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="text-xs text-gray-400">
                              {new Date(review.created_at).toLocaleDateString("en-IN")}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {review.review || "No review text"}
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            axios
                              .put(
                                `http://localhost:5000/api/admin/reviews/${review.id}/approve`
                              )
                              .then(() => {
                                setPendingReviews((prev) =>
                                  prev.filter((r) => r.id !== review.id)
                                );
                                setMessage("Review approved ✅");
                                setTimeout(() => setMessage(""), 3000);
                              })
                              .catch(console.error);
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white text-xs font-black px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 flex-shrink-0"
                        >
                          <CheckCircle size={13} /> Approve
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

          </div>
        </div>
      </div>

      <AdminFooter />
    </motion.div>
  );
}