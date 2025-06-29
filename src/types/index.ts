export interface Genre {
  id: number;
  name: string;
}

export interface SpokenLanguage {
  iso_639_1: string;
  name: string;
  english_name: string;
}

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  overview: string;
  vote_average: number;
  genres?: Genre[];
  status?: string;
  budget?: number;
  revenue?: number;
  runtime?: number;
  spoken_languages?: SpokenLanguage[];
}
