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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Baca localStorage hanya setelah client mount
    // Ini mencegah hydration mismatch karena server selalu render "ID"
    const saved = localStorage.getItem("ruka-lang") as Language;
    if (saved === "EN" || saved === "ID") {
      setLanguage(saved);
    }
    setIsMounted(true);
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

  // Selama belum mount, expose language "ID" agar match dengan server render
  const contextValue = {
    language: isMounted ? language : "ID",
    toggleLanguage,
    setLanguage: handleSetLanguage,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
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
