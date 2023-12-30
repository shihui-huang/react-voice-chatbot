import router from 'next/router';
import React, { createContext, useContext, useEffect, useState } from 'react';

type LanguageContextType = {
  selectedLanguage: string;
  changeLanguage: (language: string) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

type LanguageManagerProps = {
  children: React.ReactNode;
};

export const languageOptions: Record<string, string> = {
  'en-US': 'English',
  'fr-FR': 'Français',
  'zh-CN': '中文',
};

const LanguageManager: React.FC<LanguageManagerProps> = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en-US'); // Default language

  useEffect(() => {
    const locale = router.locale;
    setSelectedLanguage(locale || 'en-US');
  }, []);

  const changeLanguage = (language: string) => {
    setSelectedLanguage(language);
    router.push('/', undefined, { locale: language });
  };

  return (
    <LanguageContext.Provider value={{ selectedLanguage, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageManager');
  }
  return context;
};

export default LanguageManager;
