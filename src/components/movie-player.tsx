'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MoviePlayerProps {
  tmdbId: string;
}

interface StreamSource {
  name: string;
  url: string;
}

export default function MoviePlayer({ tmdbId }: MoviePlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const sources: StreamSource[] = [
    { name: 'VidSrc (HI)', url: `https://vidsrc.xyz/embed/movie/${tmdbId}?lang=hi` },
    { name: 'SuperEmbed (HI)', url: `https://multiembed.mov/?video_id=${tmdbId}&language=hi&tmdb=1` },
    { name: 'VidPlay (UR)', url: `https://vidplay.site/embed/movie/${tmdbId}?lang=ur` },
    { name: 'SuperEmbed (UR)', url: `https://multiembed.mov/?video_id=${tmdbId}&language=ur&tmdb=1` },
    { name: '2Embed', url: `https://www.2embed.to/embed/movie/${tmdbId}` },
  ];

  const [selectedSource, setSelectedSource] = useState<StreamSource>(sources[0]);
  
  const handleReportIssue = () => {
    toast({
      title: "Issue Reported",
      description: `Thanks for your feedback on ${selectedSource.name}. Please try another server while we investigate.`,
    });
  };

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
        <Button variant="ghost" size="sm" onClick={handleReportIssue} className="text-muted-foreground hover:text-foreground">
            <AlertCircle className="h-4 w-4 mr-2" />
            Report Issue
        </Button>
      </div>
    </div>
  );
}
