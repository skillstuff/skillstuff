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
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#bae0fd",
          300: "#75c7fb",
          400: "#35B8F1", // Accent
          500: "#1E88E5", // Secondary
          600: "#0B5ED7", // Primary
          700: "#0847a6",
          800: "#093b85",
          900: "#0d336a",
          950: "#092047",
          // Centralized Design Tokens
          primary: "#0B5ED7",
          secondary: "#1E88E5",
          accent: "#35B8F1",
          success: "#4DD6C2",
          bg: "#F8FAFC",
          surface: "#FFFFFF",
          dark: "#0F172A",
          text: "#0F172A",
          muted: "#64748B",
          border: "#E5E7EB",
          danger: "#EF4444",
          warning: "#F59E0B",
        },
      },
      fontFamily: {
        sans: ["Inter", "Manrope", "Outfit", "-apple-system", "sans-serif"],
        heading: ["Inter", "Plus Jakarta Sans", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      borderRadius: {
        'btn': '12px',
        'input': '12px',
        'card': '20px',
        'dialog': '24px',
        'table': '16px',
      },
      boxShadow: {
        'brand-soft': '0 8px 24px rgba(11, 94, 215, 0.08)',
        'brand-glow': '0 12px 30px rgba(11, 94, 215, 0.15)',
        'brand-elevated': '0 20px 40px rgba(11, 94, 215, 0.12)',
        '2xs': '0 1px 2px 0 rgba(15, 23, 42, 0.03)',
        'xs': '0 1px 3px 0 rgba(15, 23, 42, 0.05)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #35B8F1 0%, #1E88E5 45%, #0B5ED7 100%)',
        'brand-gradient-hover': 'linear-gradient(135deg, #4dc3f5 0%, #2b93f0 45%, #126bee 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
