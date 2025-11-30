/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Professional legal theme - trust and clarity
        background: '#f8fafc',     // Soft white
        primary: '#ffffff',        // Pure white
        secondary: '#e2e8f0',      // Light gray
        accent: '#0c4a6e',         // Deep professional blue
        accentLight: '#0369a1',    // Medium blue
        accentHover: '#075985',    // Blue hover state
        success: '#059669',        // Green for positive actions
        warning: '#dc2626',        // Red for alerts/SOS
        textPrimary: '#1e293b',    // Dark slate
        textSecondary: '#475569',  // Medium slate
        textMuted: '#64748b',      // Light slate
        border: '#cbd5e1',         // Border gray
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    }
  },
  plugins: []
}