'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../lib/i18n/translations';

const LanguageContext = createContext();

export const LANGUAGE_KEY = 'defiendete-mx-language';

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('es');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load language from localStorage
    const savedLanguage = localStorage.getItem(LANGUAGE_KEY);

    if (savedLanguage) {
      setLanguage(savedLanguage);
    } else {
      // Detect browser language
      const browserLang = navigator.language.split('-')[0];
      const supportedLanguage = ['es', 'en'].includes(browserLang) ? browserLang : 'es';
      setLanguage(supportedLanguage);
      localStorage.setItem(LANGUAGE_KEY, supportedLanguage);
    }
    
    setMounted(true);
  }, []);

  const changeLanguage = (lang) => {
    if (!['es', 'en'].includes(lang)) {
      console.warn(`Unsupported language: ${lang}`);
      return;
    }

    setLanguage(lang);
    localStorage.setItem(LANGUAGE_KEY, lang);
    document.documentElement.lang = lang;
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    return value || key;
  };

  // Prevent flash of untranslated content
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function useTranslation() {
  const { t } = useLanguage();
  return t;
}
