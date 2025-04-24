import { create } from "zustand";

// Function to load the theme before rendering
export const loadTheme = () => {
  if (typeof window !== "undefined") {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }
};

const useThemeStore = create((set) => ({
  darkMode: false,

  // Initialize theme after React mounts
  initializeTheme: () => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      const isDarkMode = savedTheme === "dark";
      set({ darkMode: isDarkMode });

      if (isDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  },

  // Toggle dark mode and update localStorage
  toggleDarkMode: () => {
    set((state) => {
      const newMode = !state.darkMode;

      if (typeof window !== "undefined") {
        localStorage.setItem("theme", newMode ? "dark" : "light");
      }

      if (newMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      return { darkMode: newMode };
    });
  },
}));

export default useThemeStore;