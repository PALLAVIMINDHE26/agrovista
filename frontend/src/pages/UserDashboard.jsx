import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";
import { CalendarCheck, MapPin, User } from "lucide-react";

export default function UserDashboard() {

  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState({});

  useEffect(() => {
  const fetchBookings = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = JSON.parse(atob(token.split(".")[1]));
    setUser(decoded);

    const res = await axios.get(
      `http://localhost:5000/api/bookings/user/${decoded.id}`
    );

    setBookings(res.data);
  };

  fetchBookings();
}, []);


  const cancelBooking = (id) => {
    axios.put(`http://localhost:5000/api/bookings/${id}`, {
      status: "cancelled"
    })
    .then(() => {
      setMessage("Booking cancelled successfully ❌");
      window.location.reload();
    });
  };

  return (
    <MainLayout>
      <div className="p-10 bg-gray-100 min-h-screen">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-green-700">
            Welcome, {user.name || "Traveler"}!👋
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your bookings and profile
          </p>
        </div>

        {/* PROFILE CARD */}
        <div className="bg-white rounded-2xl shadow p-6 mb-10 flex items-center gap-6">
          <div className="bg-green-600 w-16 h-16 flex items-center justify-center rounded-full text-white">
            <User size={30} />
          </div>

          <div>
            <h2 className="text-xl font-bold">{user.email}</h2>
            <p className="text-gray-500 capitalize">
              Role: {user.role}
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white rounded-xl shadow p-6">
            <CalendarCheck className="text-green-600 mb-3" />
            <p className="text-gray-500">Total Bookings</p>
            <h2 className="text-2xl font-bold">
              {bookings.length}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <MapPin className="text-purple-600 mb-3" />
            <p className="text-gray-500">Confirmed</p>
            <h2 className="text-2xl font-bold">
              {bookings.filter(b => b.status === "confirmed").length}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <CalendarCheck className="text-red-600 mb-3" />
            <p className="text-gray-500">Cancelled</p>
            <h2 className="text-2xl font-bold">
              {bookings.filter(b => b.status === "cancelled").length}
            </h2>
          </div>

        </div>

        {/* BOOKING TABLE */}
        <div className="bg-white rounded-2xl shadow p-6">

          <h2 className="text-xl font-bold mb-4">
            Your Booking History
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
                    {new Date(b.date).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-white ${
                      b.status === "confirmed"
                        ? "bg-green-500"
                        : b.status === "cancelled"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {b.status !== "cancelled" && (
                      <button
                        onClick={() => cancelBooking(b.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>
    </MainLayout>
  );
}
