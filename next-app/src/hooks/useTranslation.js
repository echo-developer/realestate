"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const useTranslation = () => {
  const { locale } = useRouter();
  const [translations, setTranslations] = useState({});
  const [currentLocale, setCurrentLocale] = useState(locale);

  useEffect(() => {
    const storedLang = localStorage.getItem("lang") ||"en";
    if (storedLang && storedLang !== locale) {
      setCurrentLocale(storedLang);
    } else {
      setCurrentLocale(locale);
    }
  }, [locale]);

  useEffect(() => {
    const loadTranslation = async () => {
      try {
        const response = await fetch(`/locales/${currentLocale}.json`);
        if (response.ok) {
          const data = await response.json();
          setTranslations(data);
        } else {
          console.error("Translation file not found for locale:", currentLocale);
        }
      } catch (error) {
        console.error("Error loading translation:", error);
      }
    };

    if (currentLocale) {
      loadTranslation();
    }
  }, [currentLocale]);

  return translations;
};

export default useTranslation;
