import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="fixed inset-0 bg-green-900 flex items-center justify-center z-50">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ repeat: Infinity, duration: 1 }}
        className="text-white text-3xl font-bold"
      >
        AgroVista 🌿
      </motion.h1>
    </div>
  );
}
