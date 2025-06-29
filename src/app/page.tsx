'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2, ServerCrash } from 'lucide-react';
import type { Movie } from '@/types';
import { getTrendingMovies, searchMovies } from '@/lib/tmdb';
import MovieCard from '@/components/movie-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchInitialMovies = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setMovies([]);
      setCurrentPage(1);
      const trendingMovies = await getTrendingMovies(1);
      setMovies(trendingMovies);
      setHasMore(trendingMovies.length > 0);
    } catch (err) {
      setError('Failed to fetch movies. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialMovies();
  }, []);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setSearchQuery('');
      await fetchInitialMovies();
      return;
    }
    
    setSearchQuery(searchTerm);
    try {
      setIsLoading(true);
      setError(null);
      setMovies([]);
      setCurrentPage(1);
      const searchResults = await searchMovies(searchTerm, 1);
      setMovies(searchResults);
      setHasMore(searchResults.length > 0);
    } catch (err) {
      setError('Failed to search for movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (isLoadMoreLoading) return;

    setIsLoadMoreLoading(true);
    const nextPage = currentPage + 1;
    try {
      let newMovies: Movie[] = [];
      if (searchQuery) {
        newMovies = await searchMovies(searchQuery, nextPage);
      } else {
        newMovies = await getTrendingMovies(nextPage);
      }
      
      if (newMovies.length > 0) {
        setMovies(prevMovies => [...prevMovies, ...newMovies]);
        setCurrentPage(nextPage);
      } else {
        setHasMore(false);
      }
    } catch (err) {
       setError('Failed to load more movies.');
    } finally {
      setIsLoadMoreLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold text-primary font-headline">
          Welcome to VibeStream
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover and stream your favorite movies. Instantly, no strings attached.
        </p>
        <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2 pt-4">
          <Input
            type="search"
            placeholder="Search for a movie..."
            className="flex-grow text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button type="submit" size="lg" disabled={isLoading}>
            <Search className="mr-2 h-5 w-5" />
            Search
          </Button>
        </form>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-8 font-headline">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Trending This Week'}
        </h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </div>
        ) : error ? (
           <Alert variant="destructive" className="max-w-2xl mx-auto">
            <ServerCrash className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : movies.length > 0 ? (
          <>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {movies.map((movie) => (
                <motion.div key={movie.id} variants={itemVariants}>
                  <MovieCard movie={movie} />
                </motion.div>
              ))}
            </motion.div>
            
            {hasMore && (
              <div className="flex justify-center mt-12">
                <Button onClick={handleLoadMore} disabled={isLoadMoreLoading} size="lg">
                  {isLoadMoreLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : null}
                  {isLoadMoreLoading ? 'Loading...' : 'Load More'}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-2xl font-semibold text-muted-foreground">No movies found.</p>
            <p className="text-muted-foreground mt-2">Try a different search term.</p>
          </div>
        )}
      </section>
    </div>
  );
}
