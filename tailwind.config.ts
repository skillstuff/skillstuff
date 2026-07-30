import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9", // Logo Vibrant Sky Blue
          600: "#0284c7", // Logo Primary Ocean Blue
          700: "#0369a1", // Logo Deep Blue
          800: "#075985",
          900: "#0c4a6e",
          950: "#082f49",
        },
        slate: {
          850: "#111827",
          950: "#0b0f17",
        },
      },
      fontFamily: {
        heading: ["Plus Jakarta Sans", "Inter", "-apple-system", "sans-serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      boxShadow: {
        '2xs': '0 1px 2px 0 rgba(15, 23, 42, 0.03)',
        'xs': '0 1px 3px 0 rgba(15, 23, 42, 0.05)',
      },
    },
  },
  plugins: [],
};

export default config;
