import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getMovieDetails, getMovieImageUrl } from '@/lib/tmdb';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, DollarSign, BarChart } from 'lucide-react';
import type { Movie } from '@/types';
import MoviePlayer from '@/components/movie-player';

type MoviePageProps = {
  params: {
    id: string;
  };
};

export async function generateMetadata({ params }: MoviePageProps) {
  try {
    const movie = await getMovieDetails(params.id);
    return {
      title: `${movie.title} | VibeStream`,
      description: movie.overview,
    };
  } catch (error) {
    return {
      title: 'Movie not found | VibeStream',
    }
  }
}

const DetailItem = ({ label, value, icon }: { label: string; value: string | number; icon?: React.ReactNode }) => (
    <div className="flex justify-between items-center border-b border-border/50 pb-2">
        <div className="flex items-center gap-2">
            {icon}
            <p className="font-semibold text-muted-foreground">{label}</p>
        </div>
        <p className="text-foreground">{value}</p>
    </div>
)

export default async function MoviePage({ params }: MoviePageProps) {
  let movie: Movie;

  try {
    movie = await getMovieDetails(params.id);
  } catch (error) {
    console.error(error);
    notFound();
  }

  const posterUrl = movie.poster_path
    ? getMovieImageUrl(movie.poster_path, 'w500')
    : `https://placehold.co/500x750.png`;
    
  const backdropUrl = movie.backdrop_path
    ? getMovieImageUrl(movie.backdrop_path, 'original')
    : `https://placehold.co/1280x720.png`;

  const formatCurrency = (amount: number | undefined) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const formatRuntime = (minutes: number | undefined) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  return (
    <div className="space-y-8">
      <div className="relative h-[30vh] md:h-[50vh] w-full">
        <Image
          src={backdropUrl}
          alt={`Backdrop for ${movie.title}`}
          fill
          className="object-cover object-top opacity-20"
          priority
          data-ai-hint="movie background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 -mt-[15vh] md:-mt-[20vh] relative z-10 space-y-8">
        <div className="md:flex md:items-end md:space-x-8">
            <div className="w-48 md:w-64 flex-shrink-0">
                <Image
                    src={posterUrl}
                    alt={`Poster for ${movie.title}`}
                    width={500}
                    height={750}
                    className="rounded-lg shadow-2xl"
                    data-ai-hint="movie poster"
                />
            </div>
            <div className="mt-4 md:mt-0 space-y-4">
                 <h1 className="text-4xl md:text-5xl font-bold font-headline">{movie.title}</h1>
                 <p className="text-lg text-muted-foreground">{new Date(movie.release_date).getFullYear()}</p>
                 <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 text-foreground">
                        <Star className="w-5 h-5 text-accent" />
                        <span className="font-semibold text-lg">
                            {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                        </span>
                        <span className="text-sm text-muted-foreground">/ 10</span>
                    </div>
                    {movie.runtime && (
                        <div className="flex items-center gap-2 text-foreground">
                            <Clock className="w-5 h-5 text-accent" />
                            <span className="text-lg">{formatRuntime(movie.runtime)}</span>
                        </div>
                    )}
                 </div>
                 {movie.genres && movie.genres.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    {movie.genres.map((genre) => (
                      <Badge key={genre.id} variant="secondary" className="text-sm">
                        {genre.name}
                      </Badge>
                    ))}
                  </div>
                )}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
            <div className="lg:col-span-2 space-y-8">
                 <div className="prose prose-invert max-w-none text-foreground/90 text-lg">
                    <h2 className="text-2xl font-bold font-headline border-l-4 border-primary pl-4 mb-4">Overview</h2>
                    <p>{movie.overview}</p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold font-headline border-l-4 border-primary pl-4 mb-4">Stream Now</h2>
                    <MoviePlayer tmdbId={params.id} />
                </div>
            </div>

            <aside className="space-y-6">
                 <h2 className="text-2xl font-bold font-headline border-l-4 border-primary pl-4">Details</h2>
                 <div className="space-y-4">
                     {movie.status && <DetailItem label="Status" value={movie.status} />}
                     <DetailItem label="Release Date" value={movie.release_date} />
                     {movie.budget && movie.budget > 0 && <DetailItem label="Budget" value={formatCurrency(movie.budget)} icon={<DollarSign className="w-4 h-4 text-muted-foreground" />} />}
                     {movie.revenue && movie.revenue > 0 && <DetailItem label="Revenue" value={formatCurrency(movie.revenue)} icon={<BarChart className="w-4 h-4 text-muted-foreground" />} />}
                 </div>
            </aside>
        </div>
      </div>
    </div>
  );
}
