"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X, Sun, Moon } from "lucide-react";
import useThemeStore from "@/store/themeStore";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar({
  sections = [],
  moreItems = [],
  showAuthButtons = true,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";

  const { darkMode, toggleDarkMode, initializeTheme } = useThemeStore();

  useEffect(() => {
    initializeTheme();
  }, []);

  useEffect(() => {
    if (!isHomePage) return;

    const detectActiveSection = () => {
      let currentSection = "";
      sections.concat(moreItems).forEach((section) => {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const offset = window.innerHeight * 0.3;
          if (rect.top <= offset && rect.bottom >= offset) {
            currentSection = section.id;
          }
        }
      });
      setActiveSection(currentSection || "");
    };

    detectActiveSection();
    window.addEventListener("scroll", detectActiveSection);
    return () => window.removeEventListener("scroll", detectActiveSection);
  }, [sections, moreItems, isHomePage]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const position = element.offsetTop - offset;
      window.scrollTo({ top: position, behavior: "smooth" });
      setIsOpen(false);
    } else {
      router.push(`/#${id}`);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${darkMode ? "bg-gray-900" : "bg-[#F4F0F9]"}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h2 className={`text-xl font-bold cursor-pointer ${darkMode ? "text-white" : "text-black"}`} onClick={() => scrollToSection("home")}>
          Logo
        </h2>

        <div className="hidden md:flex items-center space-x-6">
          {sections.map((item) => (
            <NavItem
              key={item.id}
              text={item.label}
              sectionId={item.id}
              active={isHomePage && activeSection === item.id}
              onClick={scrollToSection}
              darkMode={darkMode}
            />
          ))}

          {moreItems.length > 0 && (
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-1">
                <span className={darkMode ? "text-white" : "text-black"}>More Info</span>
                <ChevronDown size={16} className={darkMode ? "text-white" : "text-black"} />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-md py-2">
                  {moreItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="block px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <button onClick={toggleDarkMode}>
            {darkMode ? <Sun className="text-white" /> : <Moon className="text-black" />}
          </button>

          {showAuthButtons && (
            <>
              <button onClick={() => router.push("/login")} className="px-4 py-2 border dark:border-gray-600 dark:text-white text-black rounded-lg">Login</button>
              <button onClick={() => router.push("/signup")} className="px-4 py-2 bg-[#5B408C] text-white rounded-lg hover:bg-[#4A3577]">Sign Up</button>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center space-x-4">
          <button onClick={toggleDarkMode}>{darkMode ? <Sun className="text-white" /> : <Moon className="text-black" />}</button>
          <button onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X /> : <Menu />}</button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-3/4 sm:w-1/2 bg-white dark:bg-gray-900 shadow-lg flex flex-col space-y-6 py-8 px-6 z-50"
            ref={mobileMenuRef}
          >
            {sections.map((item) => (
              <NavItem
                key={item.id}
                text={item.label}
                sectionId={item.id}
                active={isHomePage && activeSection === item.id}
                onClick={scrollToSection}
                darkMode={darkMode}
              />
            ))}
            {moreItems.map((item) => (
              <NavItem
                key={item.id}
                text={item.label}
                sectionId={item.id}
                active={isHomePage && activeSection === item.id}
                onClick={scrollToSection}
                darkMode={darkMode}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

const NavItem = ({ text, sectionId, active, onClick, darkMode }) => (
  <motion.div whileHover={{ scale: 1.05 }}>
    <button
      onClick={() => onClick(sectionId)}
      className={`transition-all duration-300 ${
        active ? "text-[#5B408C] font-semibold" : darkMode ? "text-white" : "text-black"
      }`}
    >
      {text}
    </button>
  </motion.div>
);