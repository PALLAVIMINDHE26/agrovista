// import { useEffect, useState } from "react";
// import axios from "axios";
// import MainLayout from "../layouts/MainLayout";

// export default function Blogs() {

//   const [blogs, setBlogs] = useState([]);

//   useEffect(() => {
//     axios.get("http://localhost:5000/api/blogs")
//       .then(res => setBlogs(res.data))
//       .catch(err => console.log(err));
//   }, []);

//   return (
//     <MainLayout>
//       <div className="p-10">
//         <h1 className="text-4xl font-bold text-green-700 mb-8">
//           AgroVista Blogs 📝
//         </h1>

//         <div className="grid md:grid-cols-3 gap-8">
//           {blogs.map(blog => (
//             <div key={blog.id} className="bg-white rounded-xl shadow overflow-hidden">
//               <img src={blog.image_url} alt={blog.title} />
//               <div className="p-6">
//                 <h2 className="font-bold text-lg">{blog.title}</h2>
//                 <p className="text-gray-600 mt-2">
//                   {blog.content.substring(0, 120)}...
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </MainLayout>
//   );
// }

import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";

const Blogs = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = "c6fe05940fa2f93de9f77b2a362f69e7";

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://gnews.io/api/v4/search?q=agriculture&lang=en&country=in&max=10&apikey=${API_KEY}`
        );
        const data = await response.json();
        setArticles(data.articles || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching news:", error);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12 px-6">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-green-700 mb-4">
            🌾 Agriculture Blogs & News
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest trends, innovations, and insights in agriculture and agrotourism.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-2"
              >
                <img
                  src={
                    article.image ||
                    "https://images.unsplash.com/photo-1500382017468-9049fed747ef"
                  }
                  alt={article.title}
                  className="h-52 w-full object-cover"
                />

                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {article.description || "No description available."}
                  </p>

                  <a
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Read More →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Blogs;