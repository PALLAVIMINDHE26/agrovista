import { motion } from "framer-motion";
import MainLayout from "../layouts/MainLayout";

export default function AIChatbot() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.5 }}
    >
      <MainLayout>
        <div className="min-h-screen p-10">
          <h1 className="text-4xl font-bold text-green-700 mb-6">
            Activities 🎉
          </h1>
          <p className="text-gray-600">
            Explore the various activities available in agrotourism.
          </p>
        </div>
      </MainLayout>
    </motion.div>
  );
}
