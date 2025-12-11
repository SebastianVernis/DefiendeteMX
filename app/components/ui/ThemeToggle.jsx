'use client';

import { useTheme } from '../../contexts/ThemeContext';

/**
 * Theme Toggle Button
 * Switches between light and dark mode
 */
export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        w-12 h-12 rounded-full
        flex items-center justify-center
        bg-gray-100 dark:bg-gray-800
        hover:bg-gray-200 dark:hover:bg-gray-700
        transition-all duration-200
        text-2xl
        ${className}
      `}
      title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
      aria-label={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
