import router from 'next/router'
import React, { createContext, useContext, useEffect, useState } from 'react'

type LanguageContextType = {
  selectedLanguage: string
  changeLanguage: (language: string) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

type LanguageProviderProps = {
  children: React.ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en-US') // Default language

  useEffect(() => {
    const locale = router.locale
    setSelectedLanguage(locale || 'en-US')
  }, [])

  const changeLanguage = (language: string) => {
    setSelectedLanguage(language)
    router.push('/', undefined, { locale: language })
  }

  return <LanguageContext.Provider value={{ selectedLanguage, changeLanguage }}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
