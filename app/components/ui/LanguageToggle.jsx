'use client';

import { useEffect, useState } from 'react';

/**
 * Language Toggle Component
 * Switches between Spanish and English
 */
export default function LanguageToggle({ className = '' }) {
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState('es');

  useEffect(() => {
    // Load language from localStorage
    const savedLanguage = localStorage.getItem('defiendete-mx-language') || 'es';
    setLanguage(savedLanguage);
    setMounted(true);
  }, []);

  const toggleLanguage = () => {
    const newLang = language === 'es' ? 'en' : 'es';
    setLanguage(newLang);
    localStorage.setItem('defiendete-mx-language', newLang);
    document.documentElement.lang = newLang;
  };

  if (!mounted) {
    return (
      <div className={`px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 h-10 w-20 ${className}`} />
    );
  }

  return (
    <button
      onClick={toggleLanguage}
      className={`
        px-4 py-2 rounded-lg
        flex items-center gap-2
        bg-gray-100 dark:bg-gray-800
        hover:bg-gray-200 dark:hover:bg-gray-700
        transition-all duration-200
        font-medium text-sm
        ${className}
      `}
      title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
      aria-label={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
    >
      <span className="text-lg">🌐</span>
      <span>{language === 'es' ? 'ES' : 'EN'}</span>
    </button>
  );
}
