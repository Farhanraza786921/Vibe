'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Movie } from '@/types';
import { getMovieImageUrl } from '@/lib/tmdb';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Star } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const posterUrl = movie.poster_path
    ? getMovieImageUrl(movie.poster_path)
    : `https://placehold.co/500x750.png`;

  return (
    <Link href={`/movie/${movie.id}`} className="block group h-full">
      <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        className="h-full"
      >
        <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/20 group-hover:border-primary/50">
          <CardHeader className="p-0 relative">
             <div className="absolute top-2 right-2 z-10 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs font-semibold text-white">
                <Star className="w-3 h-3 text-accent" />
                <span>{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
            </div>
            <div className="aspect-[2/3] w-full overflow-hidden">
                <Image
                  src={posterUrl}
                  alt={`Poster for ${movie.title}`}
                  width={500}
                  height={750}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  data-ai-hint="movie poster"
                />
            </div>
          </CardHeader>
          <CardContent className="p-4 flex-grow">
              <CardTitle className="text-lg leading-tight font-semibold group-hover:text-primary transition-colors line-clamp-2">
                {movie.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{releaseYear}</p>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
};

export default MovieCard;
