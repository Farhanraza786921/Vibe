'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

interface BackdropProps {
  src: string;
  alt: string;
}

const FALLBACK_URL = 'https://placehold.co/1280x720.png';

export default function Backdrop({ src, alt }: BackdropProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageError = () => {
    setCurrentSrc(FALLBACK_URL);
  };

  return (
    <>
      {isLoading && <Skeleton className="absolute inset-0 h-full w-full" />}
      <Image
        src={currentSrc}
        alt={alt}
        fill
        className={`object-cover object-top transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-20'}`}
        priority
        data-ai-hint="movie background"
        onLoad={() => setIsLoading(false)}
        onError={handleImageError}
      />
    </>
  );
}
