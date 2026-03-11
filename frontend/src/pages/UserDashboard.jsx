import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";
import { CalendarCheck, MapPin, User, Download } from "lucide-react";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {

  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");
  // const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = token
  ? JSON.parse(atob(token.split(".")[1]))
  : null;

  /* ---------------- FETCH BOOKINGS ---------------- */

  // const fetchBookings = useCallback(async () => {
  //   try {
  //     if (!token) return;

  //     const decoded = JSON.parse(atob(token.split(".")[1]));
  //     setUser(decoded);

  //     const res = await axios.get(
  //       `http://localhost:5000/api/bookings/user/${decoded.id}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         }
  //       }
  //     );

  //     setBookings(res.data);
  //   } catch (err) {
  //     console.error("Error fetching bookings:", err);
  //   }
  // }, [token]);

  // useEffect(() => {
  //   fetchBookings();

  //   // 🔥 AUTO REFRESH EVERY 5 SECONDS (for admin approval updates)
  //   const interval = setInterval(() => {
  //     fetchBookings();
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, [fetchBookings]);

  // const decodedUser = token
  // ? JSON.parse(atob(token.split(".")[1]))
  // : null;

// 
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
  /* ---------------- CANCEL BOOKING ---------------- */

  const cancelBooking = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/bookings/${id}`,
        { status: "cancelled" },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setBookings(prev =>
        prev.map(b =>
          b.id === id ? { ...b, status: "cancelled" } : b
        )
      );

      setMessage("Booking cancelled successfully ❌");
    } catch (err) {
      console.error("Cancel error:", err);
    }
  };

  /* ---------------- INVOICE GENERATION ---------------- */

  const downloadInvoice = (booking) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("AgroVisata Booking Invoice", 20, 20);

    doc.setFontSize(12);
    doc.text(`Name: ${user?.name}`, 20, 40);
    doc.text(`Email: ${user?.email}`, 20, 50);
    doc.text(`Booking ID: ${booking.id}`, 20, 60);
    doc.text(`Booking Date: ${formatDate(booking.booking_date)}`, 20, 70);
    doc.text(`Guests: ${booking.guests}`, 20, 80);
    doc.text(`Status: ${booking.status}`, 20, 90);
    doc.text(`Amount Paid: ₹${booking.total_price}`, 20, 100);

    doc.save(`invoice_${booking.id}.pdf`);
  };

  /* ---------------- STATUS LOGIC ---------------- */

  const getStatusBadge = (booking) => {
  if (booking.status === "cancelled") {
    return { text: "Cancelled", color: "bg-red-500" };
  }

  if (
    booking.status === "confirmed" ||
    booking.status === "approved"
  ) {
    const today = new Date();
    const bookingDate = new Date(booking.booking_date);

    if (bookingDate < today) {
      return { text: "Completed", color: "bg-gray-600" };
    }

    return { text: "Upcoming", color: "bg-green-600" };
  }

  return { text: "Pending", color: "bg-yellow-500" };
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN");
};
  /* ---------------- UI ---------------- */

  return (
    <MainLayout>
      {/* <div className="p-10 min-h-screen bg-gradient-to-br from-green-50 via-emerald-100 to-lime-100 animate-fadeIn"> */}     
      <div className="relative p-10 min-h-screen bg-gradient-to-br from-green-50 via-emerald-100 to-lime-100 animate-fadeIn">
          {/* HEADER */}
        <div className="absolute top-6 right-10">
          <button
            onClick={() => navigate("/edit-profile")}
            className="px-5 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition shadow-md"
         >
              Edit Profile
         </button>
       </div>
         
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-green-700">
           Welcome {user?.name} 👋
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
            <h2 className="text-xl font-bold">{user?.email}</h2>
            <p className="text-gray-500 capitalize">
              Role: {user?.role || "user"}
            </p>
          </div>

        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white rounded-xl shadow p-6">
            <CalendarCheck className="text-green-600 mb-3" />
            <p className="text-gray-500">Total Bookings</p>
            <h2 className="text-2xl font-bold">{bookings.length}</h2>
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

        {/* BOOKINGS CARDS */}
        <div className="space-y-6">

          {message && (
            <div className="bg-green-100 text-green-700 p-3 rounded">
              {message}
            </div>
          )}

          {bookings.map((booking) => {

            const badge = getStatusBadge(booking);

            return (
              <div
                key={booking.id}
                className="bg-white rounded-2xl shadow p-6 transition transform hover:-translate-y-1 hover:shadow-xl"
              >

                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-green-700">
                    {booking.place_name}
                  </h3>

                  <span className={`px-4 py-1 text-white rounded-full ${badge.color}`}>
                    {badge.text}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-500">Destination</p>
                    <p className="font-semibold">
                      {booking.place_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Booking Date</p>
                    <p className="font-semibold">
                      {formatDate(booking.booking_date)}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Guests</p>
                    <p className="font-semibold">
                      {booking.guests}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Amount Paid</p>
                    <p className="font-semibold text-green-600">
                      ₹{booking.total_price}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 mt-4">

                  <button
                    onClick={() => downloadInvoice(booking)}
                    className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                  >
                    <Download size={16} />
                    Download Invoice
                  </button>

                  {booking.status !== "cancelled" && (
                    <button
                      onClick={() => cancelBooking(booking.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Cancel Booking
                    </button>
                  )}

                </div>

              </div>
            );
          })}

        </div>

      </div>
    </MainLayout>
  );
}