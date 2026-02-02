import { useState, useEffect, useCallback } from 'react';
import { translations, type Language } from '@/i18n/translations';

export function useLanguage() {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language') as Language;
      if (saved) return saved;
      const browserLang = navigator.language.split('-')[0];
      return browserLang === 'fa' ? 'fa' : 'en';
    }
    return 'en';
  });

  useEffect(() => {
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    localStorage.setItem('language', language);
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'fa' ? 'en' : 'fa');
  }, []);

  const setLanguageValue = useCallback((lang: Language) => {
    setLanguage(lang);
  }, []);

  const t = useCallback(
    (key: string) => {
      const keys = key.split('.');
      let value: unknown = translations[language];
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = (value as Record<string, unknown>)[k];
        } else {
          return key;
        }
      }
      return value as string;
    },
    [language]
  );

  return { language, toggleLanguage, setLanguage: setLanguageValue, t };
}
