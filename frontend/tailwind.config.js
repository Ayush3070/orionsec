/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        neon: "#00ff9f",
        electric: "#00c3ff",
        cyber: {
          red: "#ff4d4f",
        },
        panel: "#0c0c0c",
      },
      animation: {
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "slide-in": "slide-in 0.3s ease-out forwards",
      },
      keyframes: {
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 8px rgba(0, 255, 159, 0.3)" },
          "50%": { boxShadow: "0 0 16px rgba(0, 255, 159, 0.5)" },
        },
        "slide-in": {
          from: { opacity: 0, transform: "translateY(10px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};