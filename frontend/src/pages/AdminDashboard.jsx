import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";
import CountUp from "react-countup";

import {
  Users,
  CalendarCheck,
  MapPin,
  IndianRupee
} from "lucide-react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboard() {

  const [stats, setStats] = useState({});
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchBookings();
  }, []);

  const fetchStats = () => {
    axios.get("http://localhost:5000/api/admin/stats")
      .then(res => setStats(res.data));
  };

  const fetchBookings = () => {
    axios.get("http://localhost:5000/api/bookings")
      .then(res => setBookings(res.data));
  };

  const updateStatus = (id, status) => {
    axios.put(`http://localhost:5000/api/bookings/${id}`, { status })
      .then(() => {
        setMessage("Booking updated successfully ✅");
        fetchBookings();
        fetchStats();
      });
  };

  /* ================= MONTHLY GROUPING ================= */

  const monthlyData = {};

  bookings.forEach((b) => {
    const month = new Date(b.booking_date).toLocaleString("default", {
      month: "short",
    });

    if (!monthlyData[month]) {
      monthlyData[month] = { revenue: 0, count: 0 };
    }

    monthlyData[month].revenue += b.total_price;
    monthlyData[month].count += 1;
  });

  const labels = Object.keys(monthlyData);

  const revenueData = {
    labels,
    datasets: [
      {
        label: "Monthly Revenue",
        data: labels.map((m) => monthlyData[m].revenue),
        borderColor: "#16a34a",
        backgroundColor: "rgba(22,163,74,0.2)",
        tension: 0.4,
      },
    ],
  };

  const bookingData = {
    labels,
    datasets: [
      {
        label: "Bookings",
        data: labels.map((m) => monthlyData[m].count),
        backgroundColor: "#2563eb",
      },
    ],
  };

  /* ================= REVENUE GROWTH ================= */

  const months = Object.keys(monthlyData);

  const currentMonth = months[months.length - 1];
  const previousMonth = months[months.length - 2];

  const currentRevenue = currentMonth
    ? monthlyData[currentMonth].revenue
    : 0;

  const previousRevenue = previousMonth
    ? monthlyData[previousMonth].revenue
    : 0;

  const revenueGrowth =
    previousRevenue > 0
      ? (((currentRevenue - previousRevenue) / previousRevenue) * 100).toFixed(1)
      : 0;

  /* ================= TOP DESTINATION ================= */
  const destinationStats = {};

  bookings.forEach((b) => {
    const place = b.place_name; // MUST come from backend JOIN

    if (!destinationStats[place]) {
      destinationStats[place] = 0;
    }

    destinationStats[place] += 1;
  });

  const topPlace =
    Object.entries(destinationStats).sort((a, b) => b[1] - a[1])[0];

  return (
    <MainLayout>
      <div className={darkMode ? "p-10 bg-gray-900 text-white min-h-screen" : "p-10 bg-gray-100 min-h-screen"}>

        {/* ================= HEADER ================= */}
        <div className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-green-700">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Manage bookings and platform analytics
            </p>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 bg-black text-white rounded"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* ================= STAT CARDS ================= */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">

          <div className={`rounded-2xl shadow p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <Users size={26} />
            <p className="mt-4 text-gray-500">Total Users</p>
            <h2 className="text-3xl font-bold mt-1">
              <CountUp end={stats.totalUsers || 0} duration={2} />
            </h2>
          </div>

          <div className={`rounded-2xl shadow p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <CalendarCheck size={26} />
            <p className="mt-4 text-gray-500">Active Bookings</p>
            <h2 className="text-3xl font-bold mt-1">
              <CountUp end={stats.activeBookings || 0} duration={2} />
            </h2>
          </div>

          <div className={`rounded-2xl shadow p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <MapPin size={26} />
            <p className="mt-4 text-gray-500">Total Tours</p>
            <h2 className="text-3xl font-bold mt-1">
              <CountUp end={stats.totalTours || 0} duration={2} />
            </h2>
          </div>

          <div className={`rounded-2xl shadow p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <IndianRupee size={26} />
            <p className="mt-4 text-gray-500">Revenue (Total)</p>
            <h2 className="text-3xl font-bold mt-1">
              ₹ <CountUp end={stats.totalRevenue || 0} duration={2} />
            </h2>
          </div>

        </div>

        {/* ================= TABS ================= */}
        <div className="bg-gray-200 rounded-full flex mb-8 p-1 w-fit">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-6 py-2 rounded-full ${
              activeTab === "overview" ? "bg-white shadow" : ""
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-6 py-2 rounded-full ${
              activeTab === "bookings" ? "bg-white shadow" : ""
            }`}
          >
            Bookings
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-6 py-2 rounded-full ${
              activeTab === "analytics" ? "bg-white shadow" : ""
            }`}
          >
            Analytics
          </button>
        </div>

        {/* ================= OVERVIEW TAB ================= */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className={`p-6 rounded-xl shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <h3 className="font-semibold mb-4">Recent Activity</h3>
              <p>Total Users: {stats.totalUsers || 0}</p>
              <p>Total Bookings: {bookings.length}</p>
              <p>Total Revenue: ₹{bookings.reduce((sum,b)=> sum + b.total_price,0)}</p>
            </div>

            <div className={`p-6 rounded-xl shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <h3 className="font-semibold mb-4">Latest Booking</h3>
              {bookings[0] && (
                <div>
                  <p>Status: {bookings[0].status}</p>
                  <p>Date: {new Date(bookings[0].booking_date).toLocaleDateString("en-IN")}</p>
                </div>
              )}
            </div>

            {topPlace && (
              <div className={`p-6 rounded-xl shadow col-span-1 md:col-span-2 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                <h3 className="font-semibold mb-4">Top Performing Destination</h3>
                <p className="text-green-600 font-semibold">{topPlace[0]}</p>
                <p>{topPlace[1]} bookings</p>
              </div>
            )}

          </div>
        )}

        {/* ================= BOOKINGS TAB ================= */}
        {activeTab === "bookings" && (
          <div className={`rounded-2xl shadow p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <h2 className="text-xl font-bold mb-4">
              Recent Bookings
            </h2>

            {message && (
              <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                {message}
              </div>
            )}

            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="p-3">Guests</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map(b => (
                  <tr key={b.id} className="border-b">
                    <td className="p-3">{b.guests}</td>
                    <td className="p-3">
                      {new Date(b.booking_date).toLocaleDateString("en-IN")}
                    </td>
                    <td className="p-3">{b.status}</td>
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => updateStatus(b.id, "confirmed")}
                        className="bg-green-500 text-white px-3 py-1 rounded"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => updateStatus(b.id, "cancelled")}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ================= ANALYTICS TAB ================= */}
        {activeTab === "analytics" && (
          <div className="space-y-10">

            <div className={`p-6 rounded-xl shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <h3 className="text-xl font-semibold mb-2">
                Revenue Analytics
              </h3>

              <p className="text-sm text-gray-500 mb-2">
                Revenue Growth:
                <span className="text-green-600 font-semibold ml-2">
                  {revenueGrowth}% vs last month
                </span>
              </p>

              <Line data={revenueData} />
            </div>

            <div className={`p-6 rounded-xl shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <h3 className="text-xl font-semibold mb-4">
                Monthly Bookings
              </h3>
              <Bar data={bookingData} />
            </div>

          </div>
        )}

      </div>
    </MainLayout>
  );
}
