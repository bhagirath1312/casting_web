import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="h-screen flex items-center justify-center text-center bg-gradient-to-r from-blue-500 to-purple-600">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-6xl font-extrabold text-white drop-shadow-lg">
          Find Your Next Acting Role
        </h1>
        <p className="text-white text-lg mt-4">Join now and showcase your talent!</p>
        <Link href="/signup">
          <button className="mt-6 px-6 py-3 bg-white text-blue-600 rounded-full text-lg font-semibold shadow-lg hover:scale-105 transition">
            Get Started
          </button>
        </Link>
      </motion.div>
    </section>
  );
}