// "use client";

// import { signIn } from "next-auth/react";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// // import Navbar from "@/components/navbar";
// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const res = await signIn("credentials", {
//       email,
//       password,
//       redirect: false,
//     });

//     if (res?.ok && !res?.error) {
//       router.push("/profile");
//     } else {
//       alert("Invalid credentials");
//     }
//     setLoading(false);
//   };

//   return (
//     <>
   
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-500 px-4">
//       <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
//         <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
//         <form onSubmit={handleLogin} className="space-y-5">
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             required
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             required
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
//           />
//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
//               loading
//                 ? "bg-purple-300 cursor-not-allowed"
//                 : "bg-purple-600 hover:bg-purple-700"
//             }`}
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//           {/* Signup link */}
//         <p className="text-center text-sm text-gray-600 mt-4">
//           Don't have an account?{" "}
//           <Link
//             href="/signup"
//             className="text-purple-600 hover:underline font-medium"
//           >
//             Sign Up
//           </Link>
//         </p>
//         </form>
//       </div>
//     </div>
//     </>
//   );
// }



"use client";

import { signIn, getSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.ok && !res?.error) {
      // Wait a moment then fetch fresh session
      const response = await fetch("/api/auth/session");
      const session = await response.json();

      console.log("SESSION:", session); // 👈 Debug

      if (session?.user?.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/profile");
      }
    } else {
      alert("Invalid credentials");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-500 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
              loading ? "bg-purple-300 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-purple-600 hover:underline font-medium">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}