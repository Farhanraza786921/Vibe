'use client';

import Link from 'next/link';
import { Film } from 'lucide-react';
import LanguageSelector from './language-selector';

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Film className="h-8 w-8 text-primary" />
          <span className="font-bold text-2xl text-foreground font-headline">VibeStream</span>
        </Link>
        <LanguageSelector />
      </div>
    </header>
  );
};

export default Navbar;
