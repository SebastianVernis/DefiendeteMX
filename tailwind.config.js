/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        neonPink: "#ff00ff",
        neonCyan: "#00ffff",
        neonPurple: "#9d00ff",
        darkBg: "#0a0a0a"
      }
    }
  },
  plugins: []
}