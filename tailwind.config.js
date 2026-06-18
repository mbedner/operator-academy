/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17211f",
        field: "#f7f7f2",
        line: "#deded3",
        signal: "#1f6f68",
        brass: "#9b6b2f"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        executive: "0 18px 45px rgba(23, 33, 31, 0.08)"
      }
    }
  },
  plugins: []
};
