import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // University of Montana brand maroon
        maroon: {
          50:  "#fdf2f2",
          100: "#fde4e4",
          200: "#fccece",
          300: "#f9a8a8",
          400: "#f47272",
          500: "#ea4444",
          600: "#d42626",
          700: "#b31c1c",
          800: "#941a1a",
          900: "#5c1a1a",
          950: "#3b0f0f",
        },
        // Copper/gold accent
        copper: {
          300: "#deb896",
          400: "#cc9b6d",
          500: "#b87d4b",
          600: "#9e6b1e",
          700: "#7d5118",
          800: "#5e3c12",
          900: "#40280c",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
