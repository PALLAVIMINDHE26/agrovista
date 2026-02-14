import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import MainLayout from "../layouts/MainLayout";
import { motion } from "framer-motion";




export default function Culture() {
  const [data, setData] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/culture")
      .then((res) => setData(res.data));
  }, []);
  
  return (
     <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -40 }}
    transition={{ duration: 0.5 }}
      >

    <MainLayout>
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-yellow-100 p-8">
      <h1 className="text-3xl font-bold text-center text-orange-700 mb-8">
        Indian Culture & Festivals
      </h1>

     <div className="text-center mb-6">
  <input
    type="text"
    placeholder="Search festival..."
    className="p-2 border rounded w-64 mr-4"
    onChange={(e) => setSearch(e.target.value)}
  />

  <select
    className="p-2 border rounded"
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

     <div className="grid md:grid-cols-3 gap-6">
         {data
  .filter((item) =>
    selectedState ? item.state_name === selectedState : true
  )
  .filter((item) =>
    item.festival_name.toLowerCase().includes(search.toLowerCase())
  )
  .map((item) => (
    <Link
      to={`/culture/${item.id}`}
      key={item.id}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transition block"
    >
      <img
        src={item.image_url}
        alt={item.festival_name}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        <h2 className="text-xl font-semibold text-orange-700">
          {item.state_name}
        </h2>

        <h3 className="font-medium mt-2">
          🎉 {item.festival_name}
        </h3>

        <p className="text-sm text-gray-600 mt-2">
          {item.description}
        </p>
      </div>
    </Link>
  ))}

    </div>
  </div>
  </MainLayout>
  </motion.div>
  );
}

