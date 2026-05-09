export interface MovieSummary {
  imdbID: string;
  Title: string;
  Year: string;
  Type: 'movie' | 'series' | 'episode';
  Poster: string;
}

export interface MovieDetail extends MovieSummary {
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Ratings: { Source: string; Value: string }[];
  imdbRating: string;
  imdbVotes: string;
  BoxOffice: string;
}

export interface SearchResponse {
  Search: MovieSummary[];
  totalResults: string;
  Response: 'True' | 'False';
  Error?: string;
}

export interface SearchFilters {
  query: string;
  year?: string;
  type?: 'movie' | 'series' | 'episode' | '';
  page: number;
}
