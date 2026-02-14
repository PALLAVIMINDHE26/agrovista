import { motion } from "framer-motion";

export default function FeatureCard({ icon, title, text }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300 text-center"
    >
      <div className="text-4xl">{icon}</div>
      <h3 className="font-bold text-xl mt-4 text-green-700">
        {title}
      </h3>
      <p className="text-gray-600 mt-3">{text}</p>
    </motion.div>
  );
}
