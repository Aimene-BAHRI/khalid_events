// src/hooks/use-translation.ts
import { useState, useEffect } from "react";

type Language = "ar" | "en";

export function useTranslation() {
  const [language, setLanguage] = useState<Language>("ar");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsed = JSON.parse(userData);
      setLanguage(parsed.language || "ar");
    }
  }, []);

  const t = (arText: string, enText: string) => (language === "ar" ? arText : enText);

  return { language, t };
}
