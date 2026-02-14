import MainLayout from "../layouts/MainLayout";
import Hero from "../components/Hero";
import FeatureCard from "../components/FeatureCard";
import Gallery from "../components/Gallery";
import { motion } from "framer-motion";
import Stats from "../components/Stats";
import Testimonials from "../components/Testimonials";

export default function Landing() {
  return (
     <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -40 }}
    transition={{ duration: 0.5 }}
     >

    <MainLayout>
      <Hero />

      <section className="grid md:grid-cols-3 gap-8 px-10 py-20">
        <FeatureCard
          icon="🌾"
          title="Agrotourism Destinations"
          text="Explore farm stays and rural experiences across India."
        />
        <FeatureCard
          icon="🎉"
          title="Culture & Festivals"
          text="Learn about diverse traditions and celebrations."
        />
        <FeatureCard
          icon="🤖"
          title="AI Assistance"
          text="Smart chatbot and plant disease detection."
        />
      </section>
      <section className="py-20 bg-gray-100">
  <h2 className="text-3xl font-bold text-center mb-12 text-green-700">
    Latest Blogs 📝
  </h2>

  <div className="grid md:grid-cols-3 gap-8 px-10">
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-bold">Top 5 Agro Destinations in India</h3>
      <p className="text-gray-600 mt-2">
        Discover the best farm stays and rural tourism spots.
      </p>
    </div>

    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-bold">Why Agrotourism is Growing</h3>
      <p className="text-gray-600 mt-2">
        Learn how rural tourism supports local farmers.
      </p>
    </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-bold">Birdwatching in Indian Farms</h3>
         <p className="text-gray-600 mt-2">
         Explore bird biodiversity near agricultural lands.
        </p>
      </div>
    </div>
    </section>

      <Gallery />
      <Testimonials />
      <Stats />
    </MainLayout>
    </motion.div>
  );
}
