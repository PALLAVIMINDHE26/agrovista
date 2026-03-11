import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";

export default function CultureDetail() {
  const { id } = useParams();
  const [festival, setFestival] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/culture/${id}`)
      .then((res) => {
        setFestival(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching festival:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="p-10 text-center">Loading festival details...</div>
      </MainLayout>
    );
  }

  if (!festival) {
    return (
      <MainLayout>
        <div className="p-10 text-center text-red-500">
          Festival not found.
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-orange-50 py-10 px-6">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">

          {/* HERO IMAGE */}
          <img
            src={festival.image_url}
            alt={festival.festival_name}
            className="w-full h-96 object-cover"
          />

          {/* CONTENT */}
          <div className="p-8">

            {/* TITLE */}
            <h1 className="text-4xl font-bold text-orange-700">
              🎉 {festival.festival_name}
            </h1>

            <h2 className="text-lg mt-3 text-gray-600">
              📍 {festival.state_name}
            </h2>

            {/* DESCRIPTION */}
            <section className="mt-6">
              <h3 className="text-xl font-semibold text-gray-800">
                About the Festival
              </h3>
              <p className="mt-2 text-gray-700 leading-relaxed">
                {festival.description}
              </p>
            </section>

            {/* HISTORY */}
            {festival.history && (
              <section className="mt-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  Historical Background
                </h3>
                <p className="mt-2 text-gray-700 leading-relaxed">
                  {festival.history}
                </p>
              </section>
            )}

            {/* SIGNIFICANCE */}
            {festival.significance && (
              <section className="mt-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  Why It Is Celebrated
                </h3>
                <p className="mt-2 text-gray-700 leading-relaxed">
                  {festival.significance}
                </p>
              </section>
            )}

            {/* RITUALS */}
            {festival.rituals && (
              <section className="mt-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  Rituals & Traditions
                </h3>
                <p className="mt-2 text-gray-700 leading-relaxed">
                  {festival.rituals}
                </p>
              </section>
            )}

            {/* AGRICULTURAL IMPORTANCE */}
            {festival.agricultural_importance && (
              <section className="mt-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  Agricultural Importance
                </h3>
                <p className="mt-2 text-gray-700 leading-relaxed">
                  {festival.agricultural_importance}
                </p>
              </section>
            )}

          </div>
        </div>
      </div>
    </MainLayout>
  );
}
