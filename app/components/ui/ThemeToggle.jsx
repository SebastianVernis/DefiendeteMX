'use client';

import { useEffect, useState } from 'react';

/**
 * Theme Toggle Button
 * Switches between light and dark mode
 */
export default function ThemeToggle({ className = '' }) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('defiendete-mx-theme') || 'light';
    setTheme(savedTheme);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('defiendete-mx-theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  if (!mounted) {
    return (
      <div className={`w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 ${className}`} />
    );
  }

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
