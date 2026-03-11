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
    image: "/images/day.jpg",
    features: [
      "Farm tour and activities",
      "Organic lunch",
      "Bullock cart ride"
    ]
  },
  {
    id: 2,
    title: "Overnight Stay",
    duration: "1 Night / 2 Days",
    price: 2499,
    image: "/images/night.jpg",
    features: [
      "Private cottage accommodation",
      "All organic meals (3 meals)",
      "Farm activities workshop"
    ]
  },
  {
    id: 3,
    title: "Weekend Experience",
    duration: "2 Nights / 3 Days",
    price: 4999,
    image: "/images/weekend.jpg",
    popular: true,
    features: [
      "Premium cottage stay",
      "All meals included (8 meals)",
      "Organic farming workshop"
    ]
  },
  {
    id: 4,
    title: "Week-long Retreat",
    duration: "6 Nights / 7 Days",
    price: 12999,
    image: "/images/retreat.jpg",
    features: [
      "Deluxe farmhouse accommodation",
      "All organic meals (21 meals)",
      "Comprehensive farming training"
    ]
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
  const [showModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [activities, setActivities] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);

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
// Fetch activities for add-ons
  useEffect(() => {
  axios.get("http://localhost:5000/api/activities")
    .then(res => setActivities(res.data));
}, []);

  /* ================= PRICE CALCULATION ================= */
  
      // 1️⃣ Get selected activity details
        const selectedActivityDetails = activities.filter(a =>
        selectedActivities.includes(a.id)
        );

      // 2️⃣ Package subtotal
        const packageSubtotal = selectedPackage
        ? Number(selectedPackage.price) * guests
         : 0;

      // 3️⃣ Activities total
        const activitiesTotal = selectedActivityDetails.reduce(
        (sum, activity) => sum + Number(activity.price),
           0
        );

      // 4️⃣ Subtotal (package + activities)
        const subtotal = packageSubtotal + activitiesTotal;

      // 5️⃣ GST calculation
        const gst = subtotal * GST_RATE;

      // 6️⃣ Final total price
        const totalPrice = subtotal + gst;

        

        // AI-style Recommendation Logic
        const recommendedActivities = activities.filter(activity => {

        // If group booking
         if (guests >= 4) {
           return activity.category === "Outdoor";
          }

        // If single visitor
         if (guests === 1) {
           return activity.category === "Workshop";
          }

        // Default suggestion
        return activity.difficulty === "Easy";
        });

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
    // 1️⃣ CREATE BOOKING FIRST (same as your logic)
    const bookingRes = await axios.post(
      "http://localhost:5000/api/bookings",
      {
        user_id: decoded.id,
        place_id: id,
        guests,
        booking_date: date,
        total_price: totalPrice,
        activities: selectedActivities
      }
    );

    const booking = bookingRes.data.booking;

    // 2️⃣ CREATE RAZORPAY ORDER
    const orderRes = await axios.post(
      "http://localhost:5000/api/payment/create-order",
      {
        amount: totalPrice,
        bookingId: booking.id
      }
    );

    const options = {
      key: "rzp_test_SL37ZAGpzqt1bq", // YOUR TEST KEY HERE
      amount: orderRes.data.amount,
      currency: "INR",
      name: "AgroVista",
      description: "Agro Tourism Booking",
      order_id: orderRes.data.id,

      handler: async function (response) {
        // 3️⃣ VERIFY PAYMENT
        const verifyRes = await axios.post(
          "http://localhost:5000/api/payment/verify",
          response
        );

        if (verifyRes.data.success) {

          // Payment success UI (your existing logic preserved)
          setBookingSuccess(true);
          setMessage("Payment Successful! Booking Confirmed 🎉");

          // Generate PDF
          const doc = new jsPDF();
          doc.setFontSize(18);
          doc.text("AgroVista Booking Receipt", 20, 20);
          doc.setFontSize(12);
          doc.text(`Package: ${selectedPackage.title}`, 20, 40);
          doc.text(`Guests: ${guests}`, 20, 50);
          doc.text(`Date: ${date}`, 20, 60);
          doc.text(`Total: ₹ ${totalPrice.toFixed(2)}`, 20, 70);
          doc.save("AgroVista_Receipt.pdf");

          setTimeout(() => {
            navigate("/user-dashboard");
          }, 3000);

        } else {
          alert("Payment verification failed");
        }
      },

      theme: {
        color: "#16a34a",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (error) {
    console.error("Booking/Payment Error:", error);
    alert("Something went wrong");
  }
};

// Seasonal Activity Logic
      const currentMonth = new Date().getMonth();

let currentSeason = "Summer";

if (currentMonth >= 10 || currentMonth <= 1)
  currentSeason = "Winter";
else if (currentMonth >= 6 && currentMonth <= 9)
  currentSeason = "Monsoon";

const seasonalActivities = activities.filter(
  a => a.season === currentSeason
);

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
      <div className="bg-[#FAF3E8] py-16 px-8">
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
                  className={`cursor-pointer bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${                selectedPackage?.id === pkg.id
                  ? "ring-4 ring-[#7C4F2C] scale-105"
                  : ""
              }`}
            >
              <img
                src={pkg.image}
                alt={pkg.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-5">
                <h2 className="text-xl font-bold text-[#4B2E1E]">
                  {pkg.title}
                </h2>
                <p className="text-[#A47148] mb-2">{pkg.duration}</p>
                <ul className="text-sm text-gray-600 mb-4">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="text-[#7C4F2C]">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[#7C4F2C] font-bold text-lg">
                  ₹{pkg.price} per person
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= BOOKING FORM ================= */}
      <div className="p-10 bg-[#F5E6D3] min-h-screen">
        <div ref={formRef} className="bg-white p-10 rounded-3xl shadow-2xl">

          <h1 className="text-3xl font-bold text-[#4B2E1E] mb-6">
            Book Your Agro Tour 🌾
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
          {/* Activity Add-ons */}
            <h3 className="mt-6 font-semibold text-lg text-[#7C4F2C]">
             🌦 Best for {currentSeason}
            </h3>

            <div className="grid md:grid-cols-2 gap-4 mt-3">
              {seasonalActivities.slice(0,2).map(a => (
            <div
               key={a.id}
               className="border rounded-lg p-3 bg-blue-50"
            >
              <p className="font-medium">{a.title}</p>
              <p className="text-sm text-gray-600">
                 Perfect for current season
              </p>
            </div>
           ))}
          </div>

          {/* AI Recommendations */}
            <h3 className="mt-6 font-semibold text-lg text-[#7C4F2C]">
              Recommended For You
            </h3>

          <div className="grid md:grid-cols-2 gap-4 mt-3">
            {recommendedActivities.slice(0, 2).map(activity => (
          <div
             key={activity.id}
             className="border rounded-lg p-3 bg-green-50"
           >
          <p className="font-medium">{activity.title}</p>
          <p className="text-sm text-gray-600">
            Recommended based on your group size
          </p>
          </div>
       ))}
        </div>
      {/* Activity Add-ons */}
        <h3 className="mt-6 font-semibold text-lg">Select Activities</h3>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
           {activities.map(activity => (
            <label
              key={activity.id}
              className="border rounded-lg p-3 flex justify-between items-center cursor-pointer hover:bg-green-50"
            >
          <div>
           <p className="font-medium">{activity.title}</p>
           <p className="text-sm text-gray-500">₹ {activity.price}</p>
          </div>

           <input
               type="checkbox"
               value={activity.id}
               onChange={(e) => {
              if (e.target.checked) {
               setSelectedActivities([...selectedActivities, activity.id]);
               } else {
               setSelectedActivities(
                selectedActivities.filter(id => id !== activity.id)
              );
               }
             }}
             />
              </label>
           ))}
          </div>


          {/* Price Summary */}
          <div className="bg-[#FAF3E8] p-6 rounded-2xl mb-6 space-y-2">
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
              <span className="text-[#7C4F2C]">
                ₹ {totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Confirm Button */}
          <button onClick={handleBooking}
            className="w-full py-3 bg-[#7C4F2C] text-white rounded-2xl font-semibold hover:bg-[#4B2E1E] transition"          >
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
            <div className="mt-6 bg-gray-50 p-5 rounded-lg text-left">

  <h3 className="font-semibold text-gray-700 mb-3">
    Booking Summary
  </h3>

  <p className="text-sm">
    <strong>Guests:</strong> {guests}
  </p>

  <p className="text-sm">
    <strong>Date:</strong> {date}
  </p>

  <div className="mt-3">
    <p className="font-medium">Selected Activities:</p>

    {selectedActivityDetails.length > 0 ? (
      selectedActivityDetails.map((activity) => (
        <p key={activity.id} className="text-sm">
          • {activity.title} (₹ {activity.price})
        </p>
      ))
    ) : (
      <p className="text-sm text-gray-500">
        No activities selected
      </p>
    )}
  </div>

  <p className="mt-4 text-green-600 font-bold">
    Total Paid: ₹ {totalPrice}
  </p>

</div>
      <button
        onClick={() => setBookingSuccess(false)}
        className="px-6 py-3 bg-[#7C4F2C] text-white rounded-2xl hover:bg-[#4B2E1E]"
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
