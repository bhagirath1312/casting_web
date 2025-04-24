"use client"; // ✅ Required for Zustand and Next.js 13+ App Router

import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { useEffect, useCallback } from "react";
import useThemeStore, { loadTheme } from "@/store/themeStore";
import { Inter, Roboto_Mono } from "next/font/google";
import Navbar from "@/components/navbar";
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function RootLayout({ children }) {
  const { darkMode, initializeTheme } = useThemeStore();

  const initTheme = useCallback(() => {
    loadTheme();
    initializeTheme();
  }, [initializeTheme]);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  // 🚫 Wait until theme is initialized before rendering
  if (!initializeTheme) return null; // You can use a spinner here if you prefer

  return (
    <html lang="en" className={darkMode ? "dark" : ""}>
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased transition-all duration-300 ${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
        }`}
      >
        <SessionProvider>
          <Navbar 
            sections={[
              { id: "home", label: "Home" },
              { id: "about-us", label: "About Us" },
              { id: "services", label: "Services" },
            ]}
            moreItems={[
              { id: "faq", label: "FAQ" },
              { id: "contact", label: "Contact" },
            ]}
          />

          {/* Content wrapped in <main> with top padding to prevent hiding under navbar */}
          <main className="mt-16">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}