/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        panel: "rgba(255,255,255,0.04)",
        stroke: "rgba(255,255,255,0.10)",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(68,194,255,0.25), 0 18px 48px rgba(0,0,0,0.55)",
      },
    },
  },
  plugins: [],
};

