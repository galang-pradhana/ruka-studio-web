"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "ID" | "EN";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("ID");

  useEffect(() => {
    const saved = localStorage.getItem("ruka-lang") as Language;
    if (saved === "EN" || saved === "ID") {
      setLanguage(saved);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("ruka-lang", lang);
  };

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const newLang = prev === "ID" ? "EN" : "ID";
      localStorage.setItem("ruka-lang", newLang);
      return newLang;
    });
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
