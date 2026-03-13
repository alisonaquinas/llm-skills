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
          50:  "#f0f4ff",
          100: "#dce8ff",
          500: "#4f6bff",
          600: "#3a56f5",
          700: "#2d44e0",
          900: "#1a2a8c",
        },
      },
    },
  },
  plugins: [],
};

export default config;
