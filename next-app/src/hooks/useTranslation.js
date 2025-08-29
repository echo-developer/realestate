"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const translationCache = {}; // Memory cache
const translationPromises = {}; // Ongoing fetch promises

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
      // Return cached translations if available
      if (translationCache[currentLocale]) {
        setTranslations(translationCache[currentLocale]);
        return;
      }

      // Return sessionStorage if available
      const storedData = sessionStorage.getItem(`translations_${currentLocale}`);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setTranslations(parsedData);
        translationCache[currentLocale] = parsedData;
        return;
      }

      // If a fetch is already ongoing, wait for it
      if (translationPromises[currentLocale]) {
        const data = await translationPromises[currentLocale];
        setTranslations(data);
        return;
      }

      // Otherwise, start a new fetch
      const fetchPromise = fetch(`/locales/${currentLocale}.json`)
        .then((res) => {
          if (!res.ok) throw new Error("Translation file not found");
          return res.json();
        })
        .then((data) => {
          translationCache[currentLocale] = data;
          sessionStorage.setItem(`translations_${currentLocale}`, JSON.stringify(data));
          return data;
        })
        .catch((err) => {
          console.error("Error loading translation:", err);
          return {};
        });

      translationPromises[currentLocale] = fetchPromise;
      const data = await fetchPromise;
      setTranslations(data);
      // Clean up promise after fetch
      delete translationPromises[currentLocale];
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
