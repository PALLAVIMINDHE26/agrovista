import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {

  const navigate = useNavigate();

  // ✅ Decode token safely (NO useEffect, NO setState)
  const token = localStorage.getItem("token");

  let userId = null;

  if (token) {
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      userId = decoded.userId;
      console.log("Decoded Token:", decoded);
    } catch (error) {
      console.log("Token decode failed:", error);
    }
  }

  const [formData, setFormData] = useState({
    name: "",
    email: ""
  });

  const [message, setMessage] = useState("");

  // ✅ Fetch profile only if userId exists
  useEffect(() => {
    if (!userId) return;

    console.log("Fetching profile for ID:", userId);

    axios.get(`http://localhost:5000/api/users/${userId}`)
      .then(res => {
        console.log("Profile Data:", res.data);

        setFormData({
          name: res.data.name || "",
          email: res.data.email || ""
        });
      })
      .catch(err => {
        console.error("Profile fetch error:", err);
      });

  }, [userId]);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      console.log("User ID missing");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/${userId}`,
        formData
      );

      console.log("Update Response:", res.data);

      setMessage("Profile updated successfully ✅");

      setTimeout(() => {
        navigate("/user-dashboard");
      }, 1500);

    } catch (err) {
      console.error("Update error:", err);
    }
  };


  return (
    <MainLayout>
      <div className="p-10 min-h-screen bg-gradient-to-br from-green-50 via-emerald-100 to-lime-100">

        <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-xl">

          <h1 className="text-2xl font-bold mb-6 text-green-700">
            Edit Profile
          </h1>

          {message && (
            <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="mb-4">
              <label className="block mb-2 font-semibold">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-semibold">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
            >
              Save Changes
            </button>

          </form>

        </div>

      </div>
    </MainLayout>
  );
}