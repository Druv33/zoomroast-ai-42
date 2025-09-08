import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'english' | 'hindi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  english: {
    // Only roast-specific content should be translated
    roastReady: 'Your roast is ready!',
    roastGenerated: 'Generated epic roast lines! Enjoy the burn!',
    introPhraseEnglish: "Alright, let's roast this one! Here we go... ",
  },
  hindi: {
    // Only roast-specific content should be translated  
    roastReady: 'Aapka roast taiyar hai!',
    roastGenerated: 'Kamaal ke roast lines generate hui hain! Mazaa lein!',
    introPhraseHindi: "आज हम इसे roast करने वाले हैं तो चलिए शुरू करते हैं। ",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('selectedLanguage');
    return (saved as Language) || 'hindi'; // Default to Hindi
  });

  useEffect(() => {
    localStorage.setItem('selectedLanguage', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  const value = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};