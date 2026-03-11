import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function PlaceDetails() {

  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/places/${id}`)
      .then((res) => setPlace(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!place) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <MainLayout>
      <div className="p-10">

        <div className="rounded-2xl overflow-hidden shadow-lg">
          <img
            src={place.image_url}
            alt={place.name}
            className="w-full h-96 object-cover"
          />
        </div>

        <div className="mt-8">
          <h1 className="text-3xl font-bold text-green-700">
            {place.name}
          </h1>

          <p className="text-gray-500">{place.state}</p>

          <p className="mt-4 text-gray-700 leading-relaxed">
            {place.description}
          </p>

          <p className="mt-2 font-semibold">
            Rating: ⭐ {place.rating}
          </p>
        </div>

        <MapContainer
          center={[place.latitude, place.longitude]}
          zoom={13}
          className="h-96 w-full rounded-xl shadow-lg mt-10"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[place.latitude, place.longitude]}>
            <Popup>{place.name}</Popup>
          </Marker>
        </MapContainer>

        {/* Redirect Only */}
        <div className="mt-12 bg-gray-100 p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6">
            Book This Experience 🌾
          </h2>

          <button
            onClick={() => navigate(`/booknow/${place.id}`)}
            className="bg-green-600 text-white px-6 py-3 rounded-xl"
          >
            Continue to Booking
          </button>
        </div>

      </div>
    </MainLayout>
  );
}