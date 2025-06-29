'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Movie } from '@/types';
import { getMovieImageUrl } from '@/lib/tmdb';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Calendar, Star } from 'lucide-react';

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
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between items-center text-sm text-muted-foreground">
             <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{releaseYear}</span>
             </div>
             <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-accent" />
                <span className="font-semibold">{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
             </div>
          </CardFooter>
        </Card>
      </motion.div>
    </Link>
  );
};

export default MovieCard;
