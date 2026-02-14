import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";


/* ================= STEP 2 — PACKAGE DATA ================= */
const packages = [
  {
    id: 1,
    title: "Day Visit",
    duration: "1 Day (10 AM - 6 PM)",
    price: 999,
    image: "/images/day.jpg"
  },
  {
    id: 2,
    title: "Overnight Stay",
    duration: "1 Night / 2 Days",
    price: 2499,
    image: "/images/night.jpg"
  },
  {
    id: 3,
    title: "Weekend Experience",
    duration: "2 Nights / 3 Days",
    price: 4999,
    image: "/images/weekend.jpg"
  },
  {
    id: 4,
    title: "Week-long Retreat",
    duration: "6 Nights / 7 Days",
    price: 12999,
    image: "/images/retreat.jpg"
  }
];

export default function BookNow() {
  const { id } = useParams();

  const [guests, setGuests] = useState(1);
  const [date, setDate] = useState("");


  const [selectedPackage, setSelectedPackage] = useState(null);
  const formRef = useRef(null);

  const [place, setPlace] = useState(null);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const navigate = useNavigate();


  const GST_RATE = 0.05;

  /* ================= FETCH PLACE ================= */
  useEffect(() => {
    if (!id) return;

    const fetchPlace = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/places/${id}`
        );
        setPlace(res.data);
      } catch (error) {
        console.error("Error fetching place:", error);
      }
    };

    fetchPlace();
  }, [id]);

  /* ================= PRICE CALCULATION ================= */
  const subtotal = selectedPackage
    ? selectedPackage.price * guests
    : 0;

  const gst = subtotal * GST_RATE;
  const totalPrice = subtotal + gst;

  /* ================= HANDLE BOOKING ================= */
  const handleBooking = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    if (!selectedPackage) {
      alert("Please select a package");
      return;
    }

    if (!date) {
      alert("Please select a date");
      return;
    }

    const decoded = JSON.parse(atob(token.split(".")[1]));

    try {
      await axios.post("http://localhost:5000/api/bookings", {
        user_id: decoded.id,
        place_id: id,
        package_type: selectedPackage.title,
        guests,
        date: date,
        total_price: totalPrice,
      });

      // Clear form and show success message
      setShowModal(false);
      setBookingSuccess(true);
      setMessage("Booking successful! Waiting for admin confirmation.");

      // Redirect to dashboard after short delay
      setTimeout(() => {
      navigate("/user-dashboard");
      }, 2500);

      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text("AgroVista Booking Receipt", 20, 20);

      doc.setFontSize(12);
      doc.text(`Package: ${selectedPackage.title}`, 20, 40);
      doc.text(`Guests: ${guests}`, 20, 50);
      doc.text(`Date: ${date}`, 20, 60);
      doc.text(`Total: ₹ ${totalPrice.toFixed(2)}`, 20, 70);

      doc.save("AgroVista_Receipt.pdf");

    } catch (error) {
      console.error("Booking failed:", error);
    }
  };

  return (
    <MainLayout>

      {/* ===== PLACE INFO ===== */}
      {place && (
        <div className="mb-6">
          <img
            src={place.image_url}
            alt={place.name}
            className="w-full h-64 object-cover rounded-xl mb-4"
          />
          <h2 className="text-2xl font-bold">{place.name}</h2>
          <p className="text-gray-600">{place.state}</p>
        </div>
      )}

      {/* ================= PACKAGE SELECTION ================= */}
      <div className="bg-gray-100 py-12 px-6">
        <h1 className="text-3xl font-bold text-center mb-10">
          Choose Your Experience
        </h1>

        <div className="grid md:grid-cols-4 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => {
                setSelectedPackage(pkg);
                setTimeout(() => {
                  formRef.current.scrollIntoView({ behavior: "smooth" });
                }, 200);
              }}
              className={`cursor-pointer bg-white rounded-xl shadow-lg overflow-hidden transition duration-300 hover:shadow-2xl ${
                selectedPackage?.id === pkg.id
                  ? "ring-4 ring-green-500"
                  : ""
              }`}
            >
              <img
                src={pkg.image}
                alt={pkg.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-5">
                <h2 className="text-xl font-semibold">
                  {pkg.title}
                </h2>
                <p className="text-gray-500 mb-2">{pkg.duration}</p>
                <p className="text-green-600 font-bold text-lg">
                  ₹{pkg.price} per person
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= BOOKING FORM ================= */}
      <div className="p-10 bg-gray-100 min-h-screen">
        <div ref={formRef} className="bg-white p-8 rounded-xl shadow-xl">

          <h1 className="text-3xl font-bold text-green-700 mb-6">
            Book Your Agro Tour 🌿
          </h1>

          {message && (
            <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
              {message}
            </div>
          )}

          {/* Guests */}
          <div className="mb-6">
            <label className="font-semibold">Number of Guests</label>
            <div className="flex items-center gap-4 mt-3">
              <button
                onClick={() => guests > 1 && setGuests(prev => prev - 1)}
                className="bg-gray-300 px-4 py-2 rounded"
              >-</button>
              <span className="text-xl font-bold">{guests}</span>
              <button
                onClick={() => setGuests(prev => prev + 1)}
                className="bg-gray-300 px-4 py-2 rounded"
              >+</button>
            </div>
          </div>

          {/* Date */}
          <div className="mb-6">
            <label className="font-semibold">Select Date</label>
            <input 
               type="date" 
               value={date}
               onChange={(e) => setDate(e.target.value)}
               className="w-full border p-2 rounded"
            />

          </div>

          {/* Price Summary */}
          <div className="bg-gray-50 p-6 rounded-xl mb-6 space-y-2">
            <div className="flex justify-between">
              <span>Package Price</span>
              <span>
                ₹ {selectedPackage ? selectedPackage.price : 0} x {guests}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹ {subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (5%)</span>
              <span>₹ {gst.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-green-600">
                ₹ {totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Confirm Button */}
          <button onClick={handleBooking}
           className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl font-semibold hover:opacity-90 transition"
          >
            Pay ₹{totalPrice}
          </button>

          {/* Modal */}
          {showModal && (
          <div className="space-y-4 text-gray-700">

  <div className="bg-gray-100 p-4 rounded-xl">
    <h3 className="font-semibold mb-2">Booking Summary</h3>
    <p>Package: {selectedPackage?.title}</p>
    <p>Date: {date}</p>
    <p>Guests: {guests}</p>
  </div>


  <div className="bg-gray-100 p-4 rounded-xl">
    <h3 className="font-semibold mb-2">Payment Details</h3>

    <div className="flex justify-between">
      <span>Price per person</span>
      <span>₹{selectedPackage?.price}</span>
    </div>

    <div className="flex justify-between">
      <span>Guests</span>
      <span>{guests}</span>
    </div>

    <div className="flex justify-between font-semibold border-t pt-2 mt-2">
      <span>Total Amount</span>
      <span>₹{totalPrice}</span>
    </div>
  </div>

  <div className="bg-green-50 p-3 rounded-xl text-sm text-green-700">
    🔒 Secure Payment Gateway (Demo Mode)
  </div>

</div>

    )}
      
      {bookingSuccess && (
        <div className="fixed inset-0 bg-white flex flex-col justify-center items-center z-50">

        <div className="text-center">

        <div className="text-green-600 text-6xl animate-bounce mb-6">
        ✓
       </div>

        <h2 className="text-3xl font-bold mb-4">
        Booking Successful!
        </h2>

        <p className="text-gray-600 mb-6">
        Your agro-tourism experience is confirmed.
       </p>

      <button
        onClick={() => setBookingSuccess(false)}
        className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700"
      >
        Close
      </button>

      </div>
      </div>
    )}


        </div>
      </div>
    </MainLayout>
  );
}
