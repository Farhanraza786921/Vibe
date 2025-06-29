import type { Movie } from '@/types';

const API_KEY = 'b9fb81cfd0cac69fcfbf6a51b71effca';
const API_BASE_URL = 'https://api.themoviedb.org/3';

export const getTrendingMovies = async (): Promise<Movie[]> => {
  const res = await fetch(`${API_BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
  if (!res.ok) {
    throw new Error('Failed to fetch trending movies');
  }
  const data = await res.json();
  return data.results;
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  const res = await fetch(
    `${API_BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`
  );
  if (!res.ok) {
    throw new Error('Failed to search movies');
  }
  const data = await res.json();
  return data.results;
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
