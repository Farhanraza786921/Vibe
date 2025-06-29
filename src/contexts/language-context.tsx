'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  availableLanguages: { code: string; name: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const availableLanguages = [
  { code: 'en-US', name: 'English' },
  { code: 'hi-IN', name: 'हिंदी' },
  { code: 'ta-IN', name: 'தமிழ்' },
  { code: 'te-IN', name: 'తెలుగు' },
];

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<string>('en-US');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const storedLang = localStorage.getItem('preferredLanguage');
    const paramsLang = searchParams.get('lang');
    const initialLang = paramsLang || storedLang || 'en-US';
    setLanguageState(initialLang);
  }, [searchParams]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      // Remove page when language changes to reset search/trending
      params.delete('page');
      return params.toString();
    },
    [searchParams]
  );

  const setLanguage = (newLanguage: string) => {
    setLanguageState(newLanguage);
    localStorage.setItem('preferredLanguage', newLanguage);
    router.push(`${pathname}?${createQueryString('lang', newLanguage)}`, { scroll: false });
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, availableLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
