import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";
import { motion } from "framer-motion";

export default function Culture() {
  const [data, setData] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/culture")
      .then((res) => setData(res.data))
      .catch((err) => console.log("Error fetching culture:", err));
  }, []);

  // Filtered Data
  const filteredData = data
    .filter((item) =>
      selectedState ? item.state_name === selectedState : true
    )
    .filter((item) =>
      item.festival_name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.5 }}
    >
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-orange-100 to-yellow-100 p-8">

          {/* PAGE TITLE */}
          <h1 className="text-3xl font-bold text-center text-orange-700 mb-8">
            Indian Culture & Harvest Festivals
          </h1>

          {/* SEARCH & FILTER */}
          <div className="text-center mb-10">
            <input
              type="text"
              placeholder="Search festival..."
              className="p-2 border rounded w-64 mr-4 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="p-2 border rounded shadow-sm"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              <option value="">All States</option>
              {[...new Set(data.map((d) => d.state_name))].map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          {/* CULTURE GRID */}
          <div className="grid md:grid-cols-3 gap-8">
            {filteredData.map((item) => (
              <Link
                to={`/culture/${item.id}`}
                key={item.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-1 block"
              >
                {/* IMAGE */}
                <div className="relative">
                  <img
                    src={item.image_url}
                    alt={item.festival_name}
                    className="w-full h-56 object-cover"
                  />

                  <div className="absolute bottom-0 left-0 bg-black/50 text-white text-xs px-3 py-1 rounded-tr-xl">
                    {item.state_name}
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-orange-700">
                    🎉 {item.festival_name}
                  </h3>

                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                    {item.description}
                  </p>

                  <p className="text-xs text-gray-500 mt-3 italic">
                    Click to explore history, rituals & agricultural importance →
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* EMPTY STATE */}
          {filteredData.length === 0 && (
            <p className="text-center text-gray-500 mt-10">
              No festivals found.
            </p>
          )}

        </div>
      </MainLayout>
    </motion.div>
  );
}
