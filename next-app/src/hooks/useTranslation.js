"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const translationCache = {}; // Global cache to store fetched translations

const useTranslation = () => {
  const { locale } = useRouter();
  const [translations, setTranslations] = useState({});
  const [currentLocale, setCurrentLocale] = useState(locale);

  useEffect(() => {
    const storedLang = localStorage.getItem("lang") || "en";
    if (storedLang !== locale) {
      setCurrentLocale(storedLang);
    }
  }, [locale]);

  useEffect(() => {
    const loadTranslation = async () => {
      if (translationCache[currentLocale]) {
        setTranslations(translationCache[currentLocale]); // Use cached translation
        return;
      }

      try {
        const storedData = localStorage.getItem(`translations_${currentLocale}`);
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setTranslations(parsedData);
          translationCache[currentLocale] = parsedData; // Cache it
          return;
        }

        const response = await fetch(`/locales/${currentLocale}.json`);
        if (response.ok) {
          const data = await response.json();
          setTranslations(data);
          translationCache[currentLocale] = data; // Cache the data
          localStorage.setItem(`translations_${currentLocale}`, JSON.stringify(data));
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

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("dir", currentLocale === "ar" ? "rtl" : "ltr");
    }
  }, [currentLocale]);

  return translations;
};

export default useTranslation;
