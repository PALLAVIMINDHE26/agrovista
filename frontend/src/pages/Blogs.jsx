import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";

export default function Blogs() {

  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/blogs")
      .then(res => setBlogs(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <MainLayout>
      <div className="p-10">
        <h1 className="text-4xl font-bold text-green-700 mb-8">
          AgroVista Blogs 📝
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
          {blogs.map(blog => (
            <div key={blog.id} className="bg-white rounded-xl shadow overflow-hidden">
              <img src={blog.image_url} alt={blog.title} />
              <div className="p-6">
                <h2 className="font-bold text-lg">{blog.title}</h2>
                <p className="text-gray-600 mt-2">
                  {blog.content.substring(0, 120)}...
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
