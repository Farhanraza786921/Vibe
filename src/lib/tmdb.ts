import type { Movie } from '@/types';
import { recommendMovies } from '@/ai/flows/movie-recommendations';

const API_KEY = 'b9fb81cfd0cac69fcfbf6a51b71effca';
const API_BASE_URL = 'https://api.themoviedb.org/3';

const fetchMoviesFromTmdb = async (query: string, page = 1): Promise<Movie[]> => {
  const res = await fetch(
    `${API_BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
      query
    )}&include_adult=false&page=${page}`
  );
  if (!res.ok) {
    console.error(`Failed to search TMDB for: ${query}`);
    return []; // Return empty array on error so Promise.all doesn't fail completely
  }
  const data = await res.json();
  return data.results;
};

export const getTrendingMovies = async (page = 1): Promise<Movie[]> => {
  const res = await fetch(`${API_BASE_URL}/trending/movie/week?api_key=${API_KEY}&page=${page}`);
  if (!res.ok) {
    throw new Error('Failed to fetch trending movies');
  }
  const data = await res.json();
  return data.results;
};

export const searchMovies = async (query: string, page = 1): Promise<Movie[]> => {
  if (!query.trim()) {
    return [];
  }

  // Only trigger AI recommendations on the first page of search results.
  if (page > 1) {
    return fetchMoviesFromTmdb(query, page);
  }

  const tmdbResults = await fetchMoviesFromTmdb(query);

  if (tmdbResults.length < 3) {
    try {
      const existingTitles = tmdbResults.map(m => m.title);
      const aiResponse = await recommendMovies({ query, existingTitles });
      
      if (aiResponse && aiResponse.recommendations.length > 0) {
        const recommendationPromises = aiResponse.recommendations.map(title => fetchMoviesFromTmdb(title));
        const recommendedSearches = await Promise.all(recommendationPromises);
        
        const recommendedMovies = recommendedSearches
          .map(results => results[0]) // Take the top result for each recommendation search
          .filter(Boolean); // Filter out any undefined results

        // Combine and deduplicate results
        const combined = [...tmdbResults, ...recommendedMovies];
        const uniqueMovies = Array.from(new Map(combined.map(movie => [movie.id, movie])).values());
        
        return uniqueMovies;
      }
    } catch (aiError) {
      console.error("Failed to get AI recommendations:", aiError);
      // Fallback to original results if AI fails
      return tmdbResults;
    }
  }

  return tmdbResults;
};

export const getMovieDetails = async (id: string): Promise<Movie> => {
  const res = await fetch(`${API_BASE_URL}/movie/${id}?api_key=${API_KEY}`);
  if (!res.ok) {
    throw new Error('Failed to fetch movie details');
  }
  return res.json();
};

export const getMovieImageUrl = (path: string, quality: 'w500' | 'original' = 'w500') => {
  return `https://image.tmdb.org/t/p/${quality}${path}`;
};
