/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#08090D",
        surface: "#111318",
        card: "#181A21",
        line: "#292C35",
        muted: "#A7A9B4",
        accent: {
          DEFAULT: "#E5A800",
          hover: "#F5B716",
          deep: "#C68A00",
          soft: "rgba(229,168,0,0.15)",
        },
        success: "#2FBF71",
        warning: "#F5A623",
        danger: "#EF4444",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["'Space Grotesk'", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 8px 24px rgba(0,0,0,0.45)",
        lift: "0 16px 40px rgba(0,0,0,0.55)",
        accent: "0 8px 24px rgba(229,168,0,0.25)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.55 },
        },
      },
      animation: {
        shimmer: "shimmer 1.4s linear infinite",
        pulseSoft: "pulseSoft 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
