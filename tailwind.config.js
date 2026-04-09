/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Enables class-based dark mode
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/utils/**/*.{js,ts,jsx,tsx}",
    "./src/styles/**/*.css",
  ],
  theme: {
    extend: {
      colors: {
        // Light Mode Colors
        primary: "#5B408C", // Purple
        secondary: "#8D8B3A", // Olive Green
        accent: "#8E3F67", // Dark Pink
        neutral: {
          DEFAULT: "#F4F0F9", // Light background
          200: "#F4F0F9",
        },
        text: "#222222", // Dark text for light mode
        cardBg: "#FFFFFF", // Card background color for light mode

        // Dark Mode Colors
        darkBg: "#0a0a0a", // Dark mode background
        darkText: "#ededed", // Light text in dark mode
        darkCardBg: "#1a1a1a", // Dark mode card background
        grayLight: "#D1D5DB", // Light gray for borders
        grayDark: "#4B5563", // Dark gray for text in dark mode
      },
    },
  },
  plugins: [],
};