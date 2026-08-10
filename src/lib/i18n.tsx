import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import en from '@/i18n/en.json'
import hi from '@/i18n/hi.json'
import mr from '@/i18n/mr.json'

export type Language = 'en' | 'hi' | 'mr'

const translations = { en, hi, mr } as const

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
})

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, obj) as string || path
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(
    () => (localStorage.getItem('upsc_lang') as Language) || 'en'
  )

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('upsc_lang', lang)
  }, [])

  const t = useCallback((key: string): string => {
    const result = getNestedValue(translations[language] as Record<string, unknown>, key)
    if (result === key) {
      return getNestedValue(translations.en as Record<string, unknown>, key) || key
    }
    return result
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
