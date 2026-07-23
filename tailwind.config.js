/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "DM Sans", "Arial", "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: "#2558dc",
          dark: "#1a42b8",
          soft: "#eef3ff",
        },
      },
    },
  },
  plugins: [],
};
