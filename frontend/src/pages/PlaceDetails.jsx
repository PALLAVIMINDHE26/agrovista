import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";


export default function PlaceDetails() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [packageType, setPackageType] = useState("Standard");


  const handleBooking = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first!");
      return;
    }
    try {
    const decoded = jwtDecode(token);
    console.log(decoded);
    const userId = decoded.id;
     console.log("User ID:", userId);
      axios.post("http://localhost:5000/api/bookings", {
      user_id: userId,
      place_id: place.id,
    });
    } catch (error) {
    console.error("Invalid token:", error);
    alert("Session expired. Please login again.");
    return;
   }

    const totalPrice =
      packageType === "Premium"
        ? 3000 * guests
        : packageType === "Luxury"
        ? 5000 * guests
        : 2000 * guests;

    await axios.post("http://localhost:5000/api/bookings", {
      user_id: userId,
      place_id: place.id,
      booking_date: bookingDate,
      guests,
      package_type: packageType,
      total_price: totalPrice
    });

    alert("Booking Successful!");
     } catch (error) {
     console.error(error);
     alert("Booking Failed!");}
     
 };


  useEffect(() => {
    axios.get(`http://localhost:5000/api/places/${id}`)
      .then(res => setPlace(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!place) return <div className="p-10">Loading...</div>;

  return (
    <MainLayout>
      <div className="p-10">
        <h1 className="text-4xl font-bold text-green-700 mb-4">
          {place.name}
        </h1>

        <p className="text-gray-600 mb-4">
          {place.district}, {place.state}
        </p>

        <p className="mb-6">{place.description}</p>

        <MapContainer center={[place.latitude, place.longitude]} zoom={13}
             className="h-96 w-full rounded-xl shadow-lg"
        >
    <TileLayer attribution='&copy; OpenStreetMap contributors'
         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
        <Marker position={[place.latitude, place.longitude]}>
             <Popup>{place.name}</Popup>
        </Marker>
    </MapContainer>

       <div className="mt-12 bg-gray-100 dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
  <h2 className="text-2xl font-bold mb-6">Book This Experience 🌾</h2>

  {/* Package Selection */}
  <div className="mb-4">
    <label className="block mb-2">Select Package</label>
    <select
      value={packageType}
      onChange={(e) => setPackageType(e.target.value)}
      className="w-full p-2 border rounded"
    >
      <option value="Standard">Standard Package</option>
      <option value="Premium">Premium Package</option>
      <option value="Luxury">Luxury Package</option>
    </select>
  </div>

  {/* Guests */}
  <div className="mb-4">
    <label className="block mb-2">Number of Guests</label>
    <input
      type="number"
      min="1"
      value={guests}
      onChange={(e) => setGuests(e.target.value)}
      className="w-full p-2 border rounded"
    />
  </div>

  {/* Date */}
  <div className="mb-6">
    <label className="block mb-2">Booking Date</label>
    <input
      type="date"
      value={bookingDate}
      onChange={(e) => setBookingDate(e.target.value)}
      className="w-full p-2 border rounded"
    />
  </div>

     <Link to={`/book-now/${place.id}`}
        className="bg-green-600 text-white px-6 py-2 rounded-xl"
      >
        Book Now
      </Link>
   </div>

  </div>
    </MainLayout>
  );
}
