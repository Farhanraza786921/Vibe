'use client';

import { useLanguage } from '@/contexts/language-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Languages } from 'lucide-react';

export default function LanguageSelector() {
  const { language, setLanguage, availableLanguages } = useLanguage();

  const handleValueChange = (newLang: string) => {
    if (newLang) {
      setLanguage(newLang);
    }
  };
  
  return (
    <Select value={language} onValueChange={handleValueChange}>
      <SelectTrigger className="w-auto h-9 gap-2 border-none focus:ring-0 bg-transparent">
         <Languages className="h-4 w-4 text-muted-foreground" />
         <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        {availableLanguages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
