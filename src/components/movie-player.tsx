'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface MoviePlayerProps {
  tmdbId: string;
  imdbId: string | null;
}

interface StreamSource {
  name: string;
  url: string;
}

export default function MoviePlayer({ tmdbId, imdbId }: MoviePlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  
  const sources: StreamSource[] = [
    { name: 'VidSrc.to', url: `https://vidsrc.to/embed/movie/${tmdbId}` },
    imdbId ? { name: 'VidSrc.me', url: `https://vidsrc.me/embed/movie?imdb=${imdbId}` } : null,
    { name: 'SuperEmbed', url: `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1` },
  ].filter((source): source is StreamSource => source !== null);

  const [selectedSource, setSelectedSource] = useState<StreamSource | null>(sources.length > 0 ? sources[0] : null);

  if (!selectedSource) {
    return (
      <div className="w-full aspect-video bg-card flex items-center justify-center rounded-lg">
        <p className="text-muted-foreground">Streaming source not available for this movie.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="aspect-video w-full rounded-lg overflow-hidden border border-border shadow-2xl relative bg-card">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        )}
        <iframe
          key={selectedSource.url}
          src={selectedSource.url}
          referrerPolicy="origin"
          allowFullScreen
          frameBorder="0"
          className={cn("w-full h-full", isLoading ? 'opacity-0' : 'opacity-100 transition-opacity')}
          onLoad={() => setIsLoading(false)}
        ></iframe>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-sm text-muted-foreground font-semibold mr-2">Switch Server:</p>
        {sources.map((source) => (
          <Button
            key={source.name}
            variant={selectedSource.name === source.name ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              if (selectedSource.name !== source.name) {
                setSelectedSource(source);
                setIsLoading(true);
              }
            }}
            className="transition-all"
          >
            {source.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
