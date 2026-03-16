import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#020617",
          900: "#0b1220",
          850: "#0f172a"
        },
        panel: {
          DEFAULT: "#0b1220"
        },
        stroke: {
          DEFAULT: "#1f2937"
        },
        khaki: {
          500: "#6b7d2e",
          600: "#556624",
          700: "#3f4f1b"
        },
        terracotta: {
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c"
        }
      },
      boxShadow: {
        tactical: "0 24px 80px rgba(0,0,0,0.55)"
      },
      borderRadius: {
        "2xl": "1.25rem"
      },
      fontFamily: {
        display: ["ui-sans-serif", "system-ui", "Inter", "sans-serif"],
        brutal: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Inter",
          "sans-serif"
        ]
      },
      backgroundImage: {
        "tactical-radial":
          "radial-gradient(900px circle at 20% 10%, rgba(107,125,46,0.18), transparent 40%), radial-gradient(700px circle at 70% 30%, rgba(249,115,22,0.16), transparent 35%)"
      },
      keyframes: {
        pulseDot: {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "1" }
        }
      },
      animation: {
        pulseDot: "pulseDot 1.2s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;

