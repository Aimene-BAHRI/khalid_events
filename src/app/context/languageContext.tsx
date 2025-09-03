"use client";

import { createContext, useContext, useState, useEffect } from "react";

type Language = "ar" | "en" | "fr";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("ar");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setLanguage(user.language || "ar");
    }
  }, []);

  const updateLanguage = (lang: Language) => {
    setLanguage(lang);
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      localStorage.setItem("user", JSON.stringify({ ...user, language: lang }));
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: updateLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return ctx;
}
