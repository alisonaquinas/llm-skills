import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#FFF4EF",
          100: "#FFE4DA",
          200: "#FFCABA",
          300: "#FFA58F",
          400: "#FF7C61",
          500: "#F46043",
          600: "#DD4C31",
          700: "#B73A27",
          800: "#7F2D25",
          900: "#4A1D1E",
          950: "#281112",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
