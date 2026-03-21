import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import MainLayout from "../layouts/MainLayout";

export default function DiseaseDetector() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError("");
    }
  };

  const handleDetect = async () => {
    if (!image) {
      setError("Please upload a plant image first.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", image);

    try {
      const res = await axios.post(
        "http://localhost:8001/detect-disease",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setResult(res.data);
    } catch (err) {
      setError("Detection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    if (!severity) return "bg-gray-100 text-gray-700";
    const s = severity.toLowerCase();
    if (s.includes("low")) return "bg-green-100 text-green-700";
    if (s.includes("medium")) return "bg-yellow-100 text-yellow-700";
    if (s.includes("high")) return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.5 }}
    >
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-10">

          {/* HEADER */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-green-700 mb-3">
              🌿 Plant Disease Detector
            </h1>
            <p className="text-gray-600 max-w-xl mx-auto">
              Upload a photo of your plant leaf and our AI will detect
              any diseases and suggest treatments.
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10">

            {/* UPLOAD SECTION */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Upload Plant Image
              </h2>

              {/* Drag & Drop Area */}
              <label className="block border-2 border-dashed border-green-300 rounded-xl p-8 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-52 object-cover rounded-xl"
                  />
                ) : (
                  <div>
                    <div className="text-5xl mb-3">🌱</div>
                    <p className="text-gray-500">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {preview && (
                <button
                  onClick={() => {
                    setImage(null);
                    setPreview(null);
                    setResult(null);
                  }}
                  className="mt-3 text-sm text-red-500 hover:underline"
                >
                  Remove image
                </button>
              )}

              {error && (
                <p className="mt-4 text-red-500 text-sm">{error}</p>
              )}

              <button
                onClick={handleDetect}
                disabled={loading || !image}
                className="mt-6 w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                      <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  "🔍 Detect Disease"
                )}
              </button>
            </div>

            {/* RESULT SECTION */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Detection Result
              </h2>

              {!result && !loading && (
                <div className="text-center text-gray-400 mt-16">
                  <div className="text-6xl mb-4">🔬</div>
                  <p>Upload an image and click detect to see results</p>
                </div>
              )}

              {loading && (
                <div className="text-center mt-16">
                  <div className="text-5xl animate-bounce mb-4">🌿</div>
                  <p className="text-gray-500">AI is analyzing your plant...</p>
                </div>
              )}

              {result && !loading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  {/* 1. Plant Name */}
                  {result.plant_name && (
                    <div className="bg-emerald-50 p-4 rounded-xl border-l-4 border-emerald-500">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        🌱 Plant Name
                      </p>
                      <p className="text-2xl font-bold text-emerald-700">
                        {result.plant_name}
                      </p>
                    </div>
                  )}

                  {/* 2. Disease Name */}
                  <div className="bg-green-50 p-4 rounded-xl border-l-4 border-green-500">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      🦠 Detected Disease
                    </p>
                    <p className="text-2xl font-bold text-green-700">
                      {result.disease || "Unknown"}
                    </p>
                  </div>

                  {/* 3. Confidence + Severity */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">
                        📊 Confidence
                      </p>
                      <p className="text-xl font-bold text-blue-600">
                        {result.confidence}%
                      </p>
                      {/* Confidence Bar */}
                      <div className="mt-2 h-2 bg-blue-100 rounded-full">
                        <div
                          className="h-2 bg-blue-500 rounded-full transition-all duration-700"
                          style={{ width: `${result.confidence}%` }}
                        />
                      </div>
                    </div>

                    <div className={`p-4 rounded-xl ${getSeverityColor(result.severity)}`}>
                      <p className="text-xs opacity-70 mb-1">
                        ⚠️ Severity
                      </p>
                      <p className="text-xl font-bold">
                        {result.severity || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* 4. Description */}
                  {result.description && (
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                        📋 Description
                      </p>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {result.description}
                      </p>
                    </div>
                  )}

                  {/* 5. Treatment */}
                  {result.treatment && (
                    <div className="bg-yellow-50 p-4 rounded-xl border-l-4 border-yellow-400">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                        💊 Recommended Treatment
                      </p>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {result.treatment}
                      </p>
                    </div>
                  )}

                </motion.div>
              )}
            </div>
          </div>
        </div>
      </MainLayout>
    </motion.div>
  );
}