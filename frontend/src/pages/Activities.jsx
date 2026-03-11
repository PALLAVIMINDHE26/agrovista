import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { motion } from "motion/react";

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [maxPrice, setMaxPrice] = useState(1000);


  useEffect(() => {
    axios
      .get("http://localhost:5000/api/activities")
      .then((res) => setActivities(res.data));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}  
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.5 }}
    >
    <MainLayout>
      <div className="min-h-screen bg-green-50 p-8">
        <h1 className="text-3xl font-bold text-green-700 text-center mb-10">
          Agro Tourism Activities
        </h1>
        <div className="mb-6">
          <label className="font-medium">
               Max Price: ₹ {maxPrice}
          </label>

         <input
            type="range"
            min="0"
            max="1000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full"
           />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {activities
            .filter((activity) => activity.price <= maxPrice) 
            .map((activity) => (
            <Link
               to={`/activities/${activity.id}`}
               key={activity.id}
               className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-1 block"
            >
            <div className="relative">
              <div className="relative">
          <img
            src={activity.image_url}
            alt={activity.title}
            className="w-full h-52 object-cover"
           />

          {activity.average_rating >= 4 && (
            <span className="absolute top-3 right-3 bg-yellow-500 text-white text-xs px-3 py-1 rounded-full shadow-lg">
              Top Rated ⭐
           </span>
        )}
      </div>

    <span className="absolute top-3 left-3 bg-green-600 text-white text-xs px-3 py-1 rounded-full">
      {activity.category}
    </span>

    <span className="absolute top-3 right-3 bg-yellow-500 text-white text-xs px-3 py-1 rounded-full">
      {activity.difficulty}
    </span>
    </div>

        <div className="p-5">
            <h2 className="text-lg font-bold text-green-700">
            {activity.title}
            </h2>
        
          <p className="text-yellow-500 text-sm mt-1">
          ⭐ {activity.average_rating || 0} / 5
          </p>

        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
          {activity.short_description}
        </p>

        <div className="flex justify-between items-center mt-4">
          <span className="text-gray-500 text-sm">
           ⏳ {activity.duration}
         </span>

         <span className="text-green-600 font-semibold">
           ₹ {activity.price}
         </span>
         </div>
       </div>
      </Link>

          ))}
        </div>
      </div>
    </MainLayout>
    </motion.div>
  );
}
