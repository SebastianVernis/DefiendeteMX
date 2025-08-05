/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: '#1a202c', // Dark blue-gray
        primary: '#2d3748',    // Darker blue-gray
        secondary: '#4a5568',  // Medium gray
        accent: '#3182ce',      // Professional blue
        textPrimary: '#edf2f7', // Light gray/off-white
        textSecondary: '#a0aec0',// Lighter gray
      }
    }
  },
  plugins: []
}