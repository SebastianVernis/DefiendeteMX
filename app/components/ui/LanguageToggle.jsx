'use client';

import { useLanguage } from '../../contexts/LanguageContext';

/**
 * Language Toggle Component
 * Switches between Spanish and English
 */
export default function LanguageToggle({ className = '' }) {
  const { language, changeLanguage } = useLanguage();

  const toggleLanguage = () => {
    const newLang = language === 'es' ? 'en' : 'es';
    changeLanguage(newLang);
  };

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
