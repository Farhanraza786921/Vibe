import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getMovieDetails, getMovieImageUrl } from '@/lib/tmdb';
import { Badge } from '@/components/ui/badge';
import { Star, Calendar } from 'lucide-react';

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

export default async function MoviePage({ params }: MoviePageProps) {
  let movie;
  try {
    movie = await getMovieDetails(params.id);
  } catch (error) {
    console.error(error);
    notFound();
  }

  const posterUrl = movie.poster_path
    ? getMovieImageUrl(movie.poster_path, 'original')
    : `https://placehold.co/600x900.png?text=${encodeURI(movie.title)}`;

  return (
    <div className="space-y-8">
      <div className="relative h-[30vh] md:h-[50vh] w-full">
        <Image
          src={posterUrl}
          alt={`Backdrop for ${movie.title}`}
          fill
          className="object-cover object-top opacity-20"
          priority
          data-ai-hint="movie poster"
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
            <div className="mt-4 md:mt-0 space-y-3">
                 <h1 className="text-4xl md:text-5xl font-bold font-headline">{movie.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-accent" />
                        <span className="font-semibold text-lg text-foreground">
                            {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'} / 10
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                         <Calendar className="w-5 h-5 text-accent" />
                         <span className="text-lg">{movie.release_date}</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                 <div className="prose prose-invert max-w-none text-foreground/90 text-lg">
                    <h2 className="text-2xl font-bold font-headline border-l-4 border-primary pl-4 mb-4">Overview</h2>
                    <p>{movie.overview}</p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold font-headline border-l-4 border-primary pl-4 mb-4">Stream Now</h2>
                    <div className="aspect-video w-full rounded-lg overflow-hidden border border-border shadow-2xl">
                    <iframe
                        src={`https://vidsrc.to/embed/movie?tmdb=${movie.id}`}
                        referrerPolicy="origin"
                        allowFullScreen
                        frameBorder="0"
                        className="w-full h-full"
                    ></iframe>
                    </div>
                </div>
            </div>

            {/* You can add more details like cast, etc. in this column later */}
        </div>
      </div>
    </div>
  );
}
