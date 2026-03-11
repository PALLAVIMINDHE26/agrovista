import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import MainLayout from "../layouts/MainLayout";
import BookingCard from "../components/BookingCard";
// import { useNavigate } from "react-router-dom";
// import { destinations } from "../data/destinations";
import { Link } from "react-router-dom";


export default function Places() {
  const [places, setPlaces] = useState([]);
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sortOrder, setSortOrder] = useState("");


  let filteredPlaces = places
  .filter((place) =>
    place.name.toLowerCase().includes(search.toLowerCase())
  )
  .filter((place) =>
    stateFilter ? place.state === stateFilter : true
  );

if (sortOrder === "az") {
  filteredPlaces.sort((a, b) => a.name.localeCompare(b.name));
} else if (sortOrder === "za") {
  filteredPlaces.sort((a, b) => b.name.localeCompare(a.name));
}



  useEffect(() => {
  axios.get("http://localhost:5000/api/places")
    .then((res) => setPlaces(res.data))
    .catch((err) => console.error(err));
}, []);

<Navbar />

  return (
    <MainLayout>
    <div className="min-h-screen bg-green-50 p-8">
      <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">
        Agrotourism Destinations
      </h1>
      {/* Search Bar */}
      <div className="mb-10 flex justify-center">
           <input type="text" placeholder="Search destination..." value={search}
            onChange={(e) => setSearch(e.target.value)}
           className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
           />
        </div>

        <div className="flex flex-wrap gap-6 mb-8 justify-center">

  {/* State Dropdown */}
  <select
    value={stateFilter}
    onChange={(e) => setStateFilter(e.target.value)}
    className="px-4 py-2 border rounded-lg"
  >
    <option value="">All States</option>
    <option value="Maharashtra">Maharashtra</option>
    <option value="Kerala">Kerala</option>
    <option value="Assam">Assam</option>
    <option value="Rajasthan">Rajasthan</option>
    <option value="Punjab">Punjab</option>
    <option value="AndhraPradesh">Andhra Pradesh</option>
    <option value="Goa">Goa</option>
    <option value="Tamil Nadu">Tamil Nadu</option>
    <option value="Nagaland">Nagaland</option>
    <option value="Karnataka">Karnataka</option>
    <option value="Uttar Pradesh">Uttar Pradesh</option>
    <option value="Uttarakhand">Uttarakhand</option>
  </select>

  {/* Price Slider */}
  <div className="flex flex-col items-center">
    <label>Max Price: ₹{maxPrice}</label>
    <input
      type="range"
      min="1000"
      max="5000"
      step="500"
      value={maxPrice}
      onChange={(e) => setMaxPrice(e.target.value)}
    />
  </div>

  {/* Sort Dropdown */}
  <select
  value={sortOrder}
  onChange={(e) => setSortOrder(e.target.value)}
  className="px-4 py-2 border rounded-lg"
  >
  <option value="">Sort by</option>
  <option value="az">Name: A-Z</option>
  <option value="za">Name: Z-A</option>
  </select>
</div>
        {/* <div className="grid md:grid-cols-3 gap-8">
          {filteredPlaces.map((place) => {
           console.log(place.image_url);
           return <BookingCard key={place.id} place={place} />;
          })}
        </div> */}

       <div className="grid md:grid-cols-3 gap-6">
        {filteredPlaces.map((place) => (
          <Link
              to={`/places/${place.id}`}
               key={place.id}
              className="block"
            >

      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
    <img
      src={place.image_url}
      alt={place.name}
      className="h-48 w-full object-cover"
    />

    <div className="p-4">
      <h2 className="text-xl font-semibold">
        {place.name}
      </h2>

      <p className="text-gray-500">
        {place.state}
      </p>

      <p className="text-sm text-gray-600 mt-2">
        {place.description.substring(0, 80)}...
      </p>

        <p className="text-green-600 font-semibold mt-2">
        Rating: ⭐ {place.rating}
      </p> 
       </div>
      </div>
    </Link>

    ))}


  </div> 
    </div>
    </MainLayout>
  );
}
