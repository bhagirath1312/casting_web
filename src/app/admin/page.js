"use client";
import { motion } from "framer-motion";
import Navbar from "../../components/navbar";

export default function AdminDashboard() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Navbar />

      {/* Animated Admin Dashboard Box */}
      <motion.div
        className="max-w-3xl mx-auto mt-20 bg-white p-8 rounded-xl shadow-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Admin Dashboard</h2>
        <p className="text-gray-600 text-center mb-6">Manage casting calls and users with ease.</p>

        {/* Dashboard Sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Manage Casting Calls */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-6 bg-blue-600 text-white rounded-lg shadow-md cursor-pointer transition"
          >
            <h3 className="text-lg font-semibold">Manage Casting Calls</h3>
            <p className="text-sm mt-2">Add, edit, and delete casting opportunities.</p>
          </motion.div>

          {/* Manage Users */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-6 bg-purple-600 text-white rounded-lg shadow-md cursor-pointer transition"
          >
            <h3 className="text-lg font-semibold">Manage Users</h3>
            <p className="text-sm mt-2">Approve, edit, or remove user accounts.</p>
          </motion.div>

          {/* View Submissions */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-6 bg-green-600 text-white rounded-lg shadow-md cursor-pointer transition"
          >
            <h3 className="text-lg font-semibold">View Submissions</h3>
            <p className="text-sm mt-2">Review photos and videos submitted by users.</p>
          </motion.div>

          {/* Settings */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-6 bg-red-600 text-white rounded-lg shadow-md cursor-pointer transition"
          >
            <h3 className="text-lg font-semibold">Settings</h3>
            <p className="text-sm mt-2">Manage platform settings and configurations.</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}