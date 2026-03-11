import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";

export default function ActivityDetails() {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/activities/${id}`)
      .then((res) => { 
        setActivity(res.data);
        console.log(res.data.image_url);
      });
    axios
      .get(`http://localhost:5000/api/activities/${id}/reviews`)
      .then((res) => setReviews(res.data));
    }, [id]);

  if (!activity) return <div className="p-10">Loading...</div>;

  return (
    <MainLayout>
      <div className="min-h-screen bg-green-50 p-10">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">

          {/* <img
            src={activity.image_url}
            alt={activity.title}
            className="w-full h-80 object-cover"
          /> */}
          {/* Main Image */}
<img
  src={activity.image_url?.[0]}
  alt={activity.title}
  className="w-full h-80 object-cover"
/>

{/* Gallery */}
{/* <div className="grid grid-cols-3 gap-4 mt-6">
  {activity.image_url?.slice(1).map((url, index) => (
    <img
      key={index}
      src={url}
      className="rounded-lg"
    />
  ))}
</div> */}
<div className="grid grid-cols-3 gap-4 mt-6">
  {activity.image_url?.slice(1).map((url, index) => (
    <img
      key={index}
      src={url}
      alt={`Activity ${index + 1}`}
      className="w-full h-40 object-cover rounded-lg"
    />
  ))}
</div>
            {/* <div className="grid grid-cols-3 gap-4 mt-6">
            <img src={activity.image_url} className="rounded-lg" />
            <img src={activity.image_url} className="rounded-lg" />
            <img src={activity.image_url} className="rounded-lg" />
            </div> */}

          <div className="p-6">
            <h1 className="text-3xl font-bold text-green-700">
              {activity.title}
            </h1>

            <p className="text-yellow-500 text-sm mt-1">
             ⭐ {activity.average_rating || 0} / 5
            </p>

            <p className="mt-4 text-gray-700">
              {activity.full_description}
            </p>

            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Why Participate?
              </h2>
              <p className="mt-2 text-gray-700">
                {activity.why_participate}
              </p>
            </div>

            <div className="mt-6 flex justify-between">
              <p>⏳ Duration: {activity.duration}</p>
              <p className="text-green-600 font-bold">
                ₹ {activity.price}
              </p>
            </div>

            <div className="mt-10 border-t pt-8">
  <h3 className="text-xl font-semibold mb-4">
    ⭐ User Reviews
  </h3>

  {reviews.length === 0 ? (
    <p className="text-gray-500">
      No reviews yet.
    </p>
  ) : (
    <div className="space-y-4">
      {reviews.map(review => (
        <div
          key={review.id}
          className="bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition"
        >
          <p className="text-yellow-500 font-semibold">
            {"⭐".repeat(review.rating)}
          </p>

          <p className="text-gray-700 mt-2">
            {review.review}
          </p>

          <p className="text-xs text-gray-400 mt-2">
            {new Date(review.created_at).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  )}
</div>

{/* Rating Form */ }
  <div className="mt-8 border-t pt-6">
  <h3 className="text-lg font-semibold mb-3">
    Rate This Activity
  </h3>

  <div className="flex space-x-2 text-2xl cursor-pointer">
    {[1,2,3,4,5].map(num => (
      <span
        key={num}
        onClick={() => setRating(num)}
        className={`${
          num <= rating ? "text-yellow-500" : "text-gray-300"
        } hover:scale-125 transition`}
      >
        ★
      </span>
    ))}
  </div>

  <textarea
    placeholder="Write a review..."
    className="border p-2 rounded w-full mt-3"
    value={review}
    onChange={(e) => setReview(e.target.value)}
  />

  <button
    onClick={() => {
      axios.post(
        `http://localhost:5000/api/activities/${activity.id}/rate`,
        {
          user_id: localStorage.getItem("userId"),
          rating,
          review
        }
      );
      alert("Review Submitted !! Thank you for your feedback.");
    }}
    className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
  >
    Submit Rating
  </button>
</div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
