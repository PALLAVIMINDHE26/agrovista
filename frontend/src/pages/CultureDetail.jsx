import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function CultureDetail() {
  const { id } = useParams();
  const [festival, setFestival] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/culture/${id}`)
      .then((res) => setFestival(res.data));
  }, [id]);

  if (!festival) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-orange-50 p-10">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <img
          src={festival.image_url}
          alt={festival.festival_name}
          className="w-full h-72 object-cover"
        />

        <div className="p-6">
          <h1 className="text-3xl font-bold text-orange-700">
            {festival.festival_name}
          </h1>

          <h2 className="text-lg mt-2 text-gray-600">
            📍 {festival.state_name}
          </h2>

          <p className="mt-4 text-gray-700 leading-relaxed">
            {festival.description}
          </p>
        </div>
      </div>
    </div>
  );
}
