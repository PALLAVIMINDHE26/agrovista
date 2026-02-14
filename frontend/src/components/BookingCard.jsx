import { Link } from "react-router-dom";


export default function BookingCard({ place }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300">

      <img
        src={`https://source.unsplash.com/400x250/?farm,${place.state}`}
        alt={place.name}
        className="w-full h-48 object-cover"
      />

      <div className="p-6">
        <h3 className="text-xl font-bold text-green-700">
          {place.name}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {place.district}, {place.state}
        </p>

        <p className="mt-3 text-sm text-gray-500">
          {place.features}
        </p>

        <Link to={`/places/${place.id}`}>
            <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
              View Details
             </button>
        </Link>

      </div>
    </div>
  );
}
