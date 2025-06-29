'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Movie } from '@/types';
import { getMovieImageUrl } from '@/lib/tmdb';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Calendar, Clapperboard } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const posterUrl = movie.poster_path
    ? getMovieImageUrl(movie.poster_path)
    : `https://placehold.co/500x750.png?text=${encodeURI(movie.title)}`;

  return (
    <Link href={`/movie/${movie.id}`} className="block group">
      <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/20 group-hover:border-primary/50">
          <CardHeader className="p-0 relative">
            <Image
              src={posterUrl}
              alt={`Poster for ${movie.title}`}
              width={500}
              height={750}
              className="w-full h-auto object-cover"
              data-ai-hint="movie poster"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          </CardHeader>
          <CardContent className="p-4 flex-grow flex flex-col justify-between">
            <div>
              <CardTitle className="text-lg leading-tight font-semibold group-hover:text-primary transition-colors">
                {movie.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                {movie.overview}
              </p>
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-4">
              <Calendar className="w-4 h-4 mr-1.5" />
              <span>{releaseYear}</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
};

export default MovieCard;
