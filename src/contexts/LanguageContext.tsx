import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'english' | 'hindi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  english: {
    appName: 'SnapRoast',
    generateRoast: 'Generate Roast',
    uploadImage: 'Upload Image',
    takePhoto: 'Take Photo',
    generating: 'Generating...',
    roastReady: 'Your roast is ready!',
    credits: 'Credits',
    playRoast: 'Play Roast',
    downloadRoast: 'Download Roast',
    language: 'Language',
    englishLang: 'English',
    hindiLang: 'Hindi',
    roastGenerated: 'Generated epic roast lines! Enjoy the burn!',
    uploadSuccess: 'Image uploaded successfully!',
    photoReady: 'Your photo is ready for roasting. Hit Generate to create your roast!',
    introPhraseEnglish: "Alright, let's roast this one! Here we go... ",
  },
  hindi: {
    appName: 'SnapRoast',
    generateRoast: 'Roast Generate Karein',
    uploadImage: 'Photo Upload Karein',
    takePhoto: 'Photo Lein',
    generating: 'Generate Ho Raha Hai...',
    roastReady: 'Aapka roast taiyar hai!',
    credits: 'Credits',
    playRoast: 'Roast Sunein',
    downloadRoast: 'Roast Download Karein',
    language: 'Bhasha',
    englishLang: 'English',
    hindiLang: 'Hindi',
    roastGenerated: 'Kamaal ke roast lines generate hui hain! Mazaa lein!',
    uploadSuccess: 'Photo successfully upload ho gayi!',
    photoReady: 'Aapki photo roast karne ke liye taiyar hai. Generate button dabaiye!',
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